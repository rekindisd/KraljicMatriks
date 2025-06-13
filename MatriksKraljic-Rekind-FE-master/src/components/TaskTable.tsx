"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRoutes } from "@/API/routes";
import axios from "axios";
import Link from "next/link";
import { HiPencil, HiEye } from "react-icons/hi2";
import RiskImpactMatrix from "./RiskImpactMatrix";

interface Task {
  taskid: number;
  status: string;
  requisitionno: string;
  sowdesc: string;
  projectcode: number;
  discipline: string;
  procurement: string;
  category: string;
  method_output: string;
}

export default function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { projectid } = useParams();

  // Dropdown filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");
  const [procurementFilter, setProcurementFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  // Text filter states
  const [reqNoFilter, setReqNoFilter] = useState("");
  const [sowFilter, setSowFilter] = useState("");

  useEffect(() => {
    if (!projectid) return;

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          apiRoutes.tasks.byId(Number(projectid))
        );
        const sortedTasks = response.data.sort((a: Task, b: Task) => {
          if (a.status === "draft" && b.status !== "draft") return -1;
          if (a.status !== "draft" && b.status === "draft") return 1;
          return 0;
        });
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [projectid]);

  const disciplineOptions = [
    "Civil",
    "Electrical",
    "Instrument",
    "Logistic",
    "Mechanical",
    "Piping",
  ];
  const procurementOptions = ["procurement", "subcontracting"];
  const categoryOptions = [
    "Leverage Product",
    "Bottleneck Product",
    "Strategic Product",
    "Routine/Non-Critical Product",
  ];
  const methodOptions = [
    "Competitive Bidding",
    "Combined Purchase",
    "E-Procurement dengan Otomatisasi Pemesanan",
    "Market Place",
    "Partnership",
    "Binding dari Tahap Proposal",
    "Penunjukan langsung",
    "Competitive Bidding dengan Safety Stock",
  ];

  const unique = (arr: string[]) => Array.from(new Set(arr));
  const statusOptions = unique(tasks.map((t) => t.status));

  const filteredTasks = tasks.filter((task) => {
    const matchStatus =
      !statusFilter ||
      (task.status ?? "").toLowerCase() === statusFilter.toLowerCase();
    const matchReqNo =
      !reqNoFilter ||
      (task.requisitionno ?? "")
        .toLowerCase()
        .includes(reqNoFilter.toLowerCase());
    const matchSow =
      !sowFilter ||
      (task.sowdesc ?? "").toLowerCase().includes(sowFilter.toLowerCase());
    const matchDiscipline =
      !disciplineFilter ||
      (task.discipline ?? "").toLowerCase() === disciplineFilter.toLowerCase();
    const matchProcurement =
      !procurementFilter ||
      (task.procurement ?? "").toLowerCase() ===
        procurementFilter.toLowerCase();
    const matchCategory =
      !categoryFilter ||
      (task.category ?? "").toLowerCase() === categoryFilter.toLowerCase();
    const matchMethod =
      !methodFilter ||
      (task.method_output ?? "").toLowerCase() === methodFilter.toLowerCase();

    return (
      matchStatus &&
      matchReqNo &&
      matchSow &&
      matchDiscipline &&
      matchProcurement &&
      matchCategory &&
      matchMethod
    );
  });

  return (
    <div>
      <div className="w-full min-w-max mb-4">
        <RiskImpactMatrix
          setCategoryFilter={setCategoryFilter}
          categoryFilter={categoryFilter}
        />
      </div>
      <div className="w-full p-2 bg-white rounded-lg mb-2">
        <table className="w-full bg-white border border-gray-400">
          <thead className="border border-gray-400 font-normal bg-primary">
            <tr className="py-2 px-4 text-white border border-gray-400 text-sm">
              <th className="border border-gray-400 py-2 font-normal min-w-[35px]"></th>
              <th className="border border-gray-400 p-2 font-normal">No.</th>
              <th className="border border-gray-400 py-2 font-normal">
                Status
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                Requisition No
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                SOW Description
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                Discipline
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                Procurement/Subcontract
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                Category
              </th>
              <th className="border border-gray-400 py-2 font-normal">
                Purchase Method
              </th>
            </tr>
            <tr className="bg-white text-sm">
              <th className="border border-gray-400 py-2" />
              <th className="border border-gray-400 py-2" />
              <th className="border border-gray-400 p-2">
                <select
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {statusOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </th>
              <th className="border border-gray-400 p-2">
                <input
                  type="text"
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  placeholder="Filter Req. No"
                  value={reqNoFilter}
                  onChange={(e) => setReqNoFilter(e.target.value)}
                />
              </th>
              <th className="border border-gray-400 p-2">
                <input
                  type="text"
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  placeholder="Filter SOW"
                  value={sowFilter}
                  onChange={(e) => setSowFilter(e.target.value)}
                />
              </th>
              <th className="border border-gray-400 p-2">
                <select
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  value={disciplineFilter}
                  onChange={(e) => setDisciplineFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {disciplineOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </th>
              <th className="border border-gray-400 p-2">
                <select
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  value={procurementFilter}
                  onChange={(e) => setProcurementFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {procurementOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </th>
              <th className="border border-gray-400 p-2">
                <select
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {categoryOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </th>
              <th className="border border-gray-400 p-2">
                <select
                  className="w-full mx-auto px-1 border border-gray-300 rounded text-black font-normal"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {methodOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-600">
            {filteredTasks.map((task, index) => (
              <tr
                key={task.taskid}
                className={`px-4 py-2 text-black text-sm border border-gray-400 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="text-center border border-gray-400">
                  <Link
                    href={`/${projectid}/task/${task.taskid}`}
                    className="px-2 py-1 text-black hover:text-blue-500"
                  >
                    {task.status === "success" ? (
                      <HiEye className="inline h-4 w-4" />
                    ) : (
                      <HiPencil className="inline h-4 w-4" />
                    )}
                  </Link>
                </td>
                <td className="text-center border border-gray-400">
                  {index + 1}
                </td>
                <td className="text-center border border-gray-400 py-2">
                  {task.status === "success" ? (
                    <button className="bg-green-100 text-green-700 border border-green-700 rounded-3xl px-2 text-[9pt] font-medium w-16 m-1 cursor-default">
                      {task.status}
                    </button>
                  ) : (
                    <button className="bg-gray-100 text-gray-500 border border-gray-500 rounded-3xl px-2 text-[9pt] font-medium w-16 m-1 cursor-default">
                      {task.status}
                    </button>
                  )}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.requisitionno}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.sowdesc}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.discipline}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.procurement}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.category}
                </td>
                <td className="border border-gray-400 pl-2 py-2">
                  {task.method_output}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
