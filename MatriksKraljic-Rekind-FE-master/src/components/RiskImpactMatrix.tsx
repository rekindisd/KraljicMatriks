"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { apiRoutes } from "@/API/routes";
import { useParams } from "next/navigation";

interface RiskImpactMatrixProps {
  setCategoryFilter: (category: string) => void;
  categoryFilter: string;
}

const RiskImpactMatrix: React.FC<RiskImpactMatrixProps> = ({
  setCategoryFilter,
  categoryFilter,
}) => {
  const svgRef = useRef(null);

  const getCellColor = (x: number, y: number) => {
    if (x <= 2 && y <= 2) return "#90EE90"; // Light green for Routine
    if (x >= 3 && y >= 3) return "#FFA07A"; // Light coral for Strategic
    return "#FFFF00"; // Yellow for Leverage and Bottleneck
  };

  interface Score {
    id: number;
    supply_risk: number;
    business_impact: number;
  }

  const [score, setScore] = useState<Score[]>([]);
  const [lastClickedCategory, setLastClickedCategory] = useState<
    | "Routine/Non-Critical Product"
    | "Leverage Product"
    | "Bottleneck Product"
    | "Strategic Product"
    | null
  >(null);
  const { projectid } = useParams();

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await axios.get(
          apiRoutes.kraljic.all(Number(projectid))
        );
        const data = response.data;
        setScore(data);
      } catch (err) {
        console.error("Error fetching score:", err);
      }
    };
    fetchScore();
  }, [projectid]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set smaller margins so the matrix is not too large
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right; // reduced width
    const height = 500 - margin.top - margin.bottom; // reduced height

    const cellSize = width / 4;
    const data = score;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("display", "block") // center horizontally
      .style("margin", "0 auto") // center horizontally
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create grid
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const yPos = height - (y + 1) * cellSize; // Invert Y axis

        // Add cell rectangle
        svg
          .append("rect")
          .attr("x", x * cellSize)
          .attr("y", yPos)
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("fill", getCellColor(x + 1, y + 1))
          .attr("stroke", "#888") // Light gray for cell borders
          .attr("stroke-width", 1)
          .style("cursor", "pointer")
          .style("transition", "fill 0.2s ease");

        // Add coordinates with lighter color
        svg
          .append("text")
          .attr("x", x * cellSize + cellSize / 2)
          .attr("y", yPos + cellSize / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(`(${x + 1},${y + 1})`);
      }
    }
    // Menyimpan warna asli untuk setiap sel
    svg.selectAll("rect").each(function () {
      const rect = d3.select(this);
      rect.attr("data-original-color", rect.attr("fill"));
    });

    // Menyimpan kategori yang terakhir diklik dan status apakah kategori sudah diklik

    svg.selectAll("rect").on("click", function () {
      const x = Math.floor(Number(d3.select(this).attr("x")) / cellSize) + 1;
      const y = 4 - Math.floor(Number(d3.select(this).attr("y")) / cellSize);

      let clickedCategory:
        | "Routine/Non-Critical Product"
        | "Leverage Product"
        | "Bottleneck Product"
        | "Strategic Product"
        | null = null;
      if (x <= 2 && y <= 2) clickedCategory = "Routine/Non-Critical Product";
      else if (x <= 2 && y > 2) clickedCategory = "Leverage Product";
      else if (x > 2 && y <= 2) clickedCategory = "Bottleneck Product";
      else if (x > 2 && y > 2) clickedCategory = "Strategic Product";

      console.log(clickedCategory, lastClickedCategory);

      if (clickedCategory === lastClickedCategory) {
        svg.selectAll("rect").attr("fill", function () {
          return d3.select(this).attr("data-original-color");
        });
        setCategoryFilter("");
        setLastClickedCategory(null);
      } else {
        svg.selectAll("rect").attr("fill", function () {
          const cellX =
            Math.floor(Number(d3.select(this).attr("x")) / cellSize) + 1;
          const cellY =
            4 - Math.floor(Number(d3.select(this).attr("y")) / cellSize);

          let cellCategory:
            | "Routine/Non-Critical Product"
            | "Leverage Product"
            | "Bottleneck Product"
            | "Strategic Product"
            | null = null;
          if (cellX <= 2 && cellY <= 2)
            cellCategory = "Routine/Non-Critical Product";
          else if (cellX <= 2 && cellY > 2) cellCategory = "Leverage Product";
          else if (cellX > 2 && cellY <= 2) cellCategory = "Bottleneck Product";
          else if (cellX > 2 && cellY > 2) cellCategory = "Strategic Product";

          return cellCategory === clickedCategory
            ? getCellColor(cellX, cellY)
            : "#D3D3D3";
        });
        setCategoryFilter(clickedCategory || "");
        setLastClickedCategory(clickedCategory);
      }
    });

    // Add category separator lines
    // Vertical separator at x=2
    svg
      .append("line")
      .attr("x1", cellSize * 2)
      .attr("y1", 0)
      .attr("x2", cellSize * 2)
      .attr("y2", height)
      .attr("stroke", "#888") // Medium gray for category separators
      .attr("stroke-width", 2);

    // Horizontal separator at y=2
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", height - cellSize * 2)
      .attr("x2", width)
      .attr("y2", height - cellSize * 2)
      .attr("stroke", "#888") // Medium gray for category separators
      .attr("stroke-width", 2);

    // Add zone labels
    svg
      .append("text")
      .attr("x", cellSize)
      .attr("y", height - cellSize)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Routine /");

    svg
      .append("text")
      .attr("x", cellSize)
      .attr("y", height - cellSize + 20)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Non-Critical Product");

    svg
      .append("text")
      .attr("x", cellSize * 3)
      .attr("y", height - cellSize * 3)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Strategic Product");

    svg
      .append("text")
      .attr("x", cellSize)
      .attr("y", height - cellSize * 3)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Leverage Product");

    svg
      .append("text")
      .attr("x", cellSize * 3)
      .attr("y", height - cellSize)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Bottleneck Product");

    // Add axes labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Average Supply Risk Score");

    svg
      .append("text")
      .attr("x", width/2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "600")
      .text("Supply Risk vs Business Impact Score");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .text("Average Business Impact Score");

    // Add axis numbers
    for (let i = 0; i < 4; i++) {
      svg
        .append("text")
        .attr("x", i * cellSize + cellSize / 2)
        .attr("y", height + 20)
        .attr("text-anchor", "middle")
        .text(i + 1);

      svg
        .append("text")
        .attr("x", -20)
        .attr("y", height - (i * cellSize + cellSize / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(i + 1);
    }

    // Group the data by (supply_risk, business_impact)
    const groupedData = d3.groups(
      data,
      (d) => d.supply_risk,
      (d) => d.business_impact
    );

    // Plot each group in a radial pattern
    groupedData.forEach(([risk, subArray]) => {
      subArray.forEach(([impact, items]) => {
        // Center of the cell for these items:
        const baseX = (risk - 1) * cellSize + cellSize / 2;
        const baseY = height - ((impact - 1) * cellSize + cellSize / 2);

        // Radius for distribution
        const radius = 10;

        // Create a circle for each data point in this group
        items.forEach((d, i) => {
          const angle = (2 * Math.PI * i) / items.length;
          const offsetX = radius * Math.cos(angle);
          const offsetY = radius * Math.sin(angle);

          svg
            .append("circle")
            .attr("cx", baseX + offsetX)
            .attr("cy", baseY + offsetY)
            .attr("r", 3)
            .attr("fill", "#1976D2")
            .attr("opacity", 0.8);
        });
      });
    });

    // Update warna berdasarkan kategori yang dipilih
    svg.selectAll("rect").attr("fill", function () {
      const cellX =
        Math.floor(Number(d3.select(this).attr("x")) / cellSize) + 1;
      const cellY =
        4 - Math.floor(Number(d3.select(this).attr("y")) / cellSize);

      // Tentukan kategori dari sel yang sedang diproses
      let cellCategory:
        | "Routine/Non-Critical Product"
        | "Leverage Product"
        | "Bottleneck Product"
        | "Strategic Product"
        | null = null;
      if (cellX <= 2 && cellY <= 2)
        cellCategory = "Routine/Non-Critical Product";
      else if (cellX <= 2 && cellY > 2) cellCategory = "Leverage Product";
      else if (cellX > 2 && cellY <= 2) cellCategory = "Bottleneck Product";
      else if (cellX > 2 && cellY > 2) cellCategory = "Strategic Product";

      if (cellCategory === categoryFilter) {
        return getCellColor(cellX, cellY);
      } else if (categoryFilter === "") {
        return d3.select(this).attr("data-original-color");
      } else {
        return "#D3D3D3";
      }
    });
  }, [score, setCategoryFilter, categoryFilter, lastClickedCategory]);

  return (
    <div className="w-full p-2 bg-white rounded-lg">
      <svg ref={svgRef} className="mx-auto -pt-10" />
    </div>
  );
};

export default RiskImpactMatrix;
