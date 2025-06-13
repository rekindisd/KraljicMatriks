"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { apiRoutes } from "@/API/routes";
import ConfirmationModal from '@/components/ConfirmationModal';

interface TaskDetails {
  projectname: string;
  projectcode: string;
  procurement: string;
  discipline: string;
  requisitionno: string;
  scopeofwork: string;
}

interface RadioGroupProps {
  field: string;
  value: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  field,
  value,
  onChange,
  disabled,
}) => (
  <div className="flex gap-4">
    {[1, 2, 3, 4].map((num) => (
      <label
        key={num}
        className={`
          flex items-center justify-center
          w-12 h-8 rounded
          ${disabled ? "" : "cursor-pointer"}
          ${
            value === num.toString()
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }
          transition-colors
        `}
      >
        <input
          type="radio"
          name={field}
          value={num}
          checked={value === num.toString()}
          onChange={(e) => onChange(field, e.target.value)}
          disabled={disabled}
          className="hidden"
        />
        {num}
      </label>
    ))}
  </div>
);

export default function MatrixForm() {
  const { taskid, projectid } = useParams();
  const router = useRouter();
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [formValues, setFormValues] = useState({
    magnitude: "",
    impact: "",
    repurchase: "",
    complexity: "",
    design: "",
    supplier: "",
    manufacturer: "",
    materials: "",
  });
  const [supplyRiskScore, setSupplyRiskScore] = useState<number | null>(null);
  const [businessImpactScore, setBusinessImpactScore] = useState<number | null>(
    null
  );
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [procurementOptions, setProcurementOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task details
        const taskResponse = await axios.get(
          apiRoutes.tasks.details(Number(taskid))
        );
        setTaskDetails(taskResponse.data[0]);

        try {
          const kraljicResponse = await axios.get(
            apiRoutes.kraljic.byId(Number(taskid)),
            {
              validateStatus: function (status) {
                return status < 500;
              },
            }
          );

          if (kraljicResponse.status === 200) {
            setIsViewOnly(true);
            setFormValues({
              magnitude: kraljicResponse.data.magnitude_work.toString(),
              impact: kraljicResponse.data.impact_schedule.toString(),
              repurchase:
                kraljicResponse.data.possibility_repurchase.toString(),
              complexity: kraljicResponse.data.complexity_work.toString(),
              design: kraljicResponse.data.design_factors.toString(),
              supplier: kraljicResponse.data.supplier_rating.toString(),
              manufacturer: kraljicResponse.data.approved_manufacturer.toString(),
              materials: kraljicResponse.data.materials_construction.toString(),
            });
            setSupplyRiskScore(kraljicResponse.data.supply_risk);
            setBusinessImpactScore(kraljicResponse.data.business_impact);
            setProductCategory(kraljicResponse.data.category);
            setSelectedOption(kraljicResponse.data.method_output);
  
          }
        } catch (err) {
          console.error("Error fetching Kraljic data:", err);
        }
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    };

    fetchData();
  }, [taskid]);

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => {
      const newFormValues = {
        ...prev,
        [field]: value,
      };

      // Check if all fields are filled
      const allFieldsFilled = Object.values(newFormValues).every(
        (val) => val !== ""
      );

      if (allFieldsFilled) {
        // Calculate Supply Risk Score
        const supplyRisk = Math.max(
          Number(newFormValues.complexity),
          Number(newFormValues.design),
          Number(newFormValues.supplier),
          Number(newFormValues.manufacturer),
          Number(newFormValues.materials)
        );
        setSupplyRiskScore(supplyRisk);

        // Calculate Business Impact Score
        const avg =
          (Number(newFormValues.magnitude) +
            Number(newFormValues.impact) +
            Number(newFormValues.repurchase)) /
          3;
        const businessImpact = Math.ceil(avg);
        setBusinessImpactScore(businessImpact);

        // Determine Product Category
        const category = determineProductCategory(supplyRisk, businessImpact);
        setProductCategory(category);

        // Determine Procurement Options
        const options = determineProcurementOptions(category);
        setProcurementOptions(options);
      }

      return newFormValues;
    });
  };

  const determineProductCategory = (
    supplyRisk: number,
    businessImpact: number
  ): string => {
    if (supplyRisk > 2 && businessImpact > 2) {
      return "Strategic Product";
    } else if (supplyRisk > 2 && businessImpact <= 2) {
      return "Bottleneck Product";
    } else if (supplyRisk <= 2 && businessImpact > 2) {
      return "Leverage Product";
    } else {
      return "Routine/Non-Critical Product";
    }
  };

  const determineProcurementOptions = (category: string): string[] => {
    switch (category) {
      case "Leverage Product":
        return [
          "Competitive Bidding",
          "Combined Purchase",
          "E-Procurement dengan Otomatisasi Pemesanan",
        ];
      case "Routine/Non-Critical Product":
        return [
          "Combined Purchase",
          "E-Procurement dengan Otomatisasi Pemesanan",
          "Market Place",
        ];
      case "Bottleneck Product":
        return ["Competitive Bidding dengan Safety Stock"];
      case "Strategic Product":
        return [
          "Partnership",
          "Binding dari Tahap Proposal",
          "Penunjukan Langsung",
          "Competitive Bidding",
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleConfirmSubmit = async () => {
    const payload = {
      taskId: Number(taskid),
      magnitudeOfWork: Number(formValues.magnitude),
      impactOnSchedule: Number(formValues.impact),
      possibilityRePurchase: Number(formValues.repurchase),
      complexityOfWork: Number(formValues.complexity),
      designFactors: Number(formValues.design),
      supplierPerformanceRating: Number(formValues.supplier),
      approvedManufacturerList: Number(formValues.manufacturer),
      materialsOfConstruction: Number(formValues.materials),
      supplyRiskScore: supplyRiskScore,
      businessImpactScore: businessImpactScore,
      category: productCategory,
      methodOutput: selectedOption,
    };
  
    try {
      console.log("Submitting data:", payload);
      await axios.post(apiRoutes.kraljic.main, payload);
      alert("Data submitted successfully!");
      router.push(`/${projectid}`);
    } catch (err) {
      console.error("Error submitting data:", err);
      alert("Failed to submit data.");
    }
  };

  const formFields = [
    { label: "Magnitude of Work", field: "magnitude" },
    { label: "Impact On Schedule", field: "impact" },
    { label: "Re-Purchase Possibility", field: "repurchase" },
    { label: "Complexity of Work", field: "complexity" },
    { label: "Design Factors", field: "design" },
    { label: "Supplier Performance Rating", field: "supplier" },
    { label: "Approved Manufacturer List", field: "manufacturer" },
    { label: "Materials of Construction", field: "materials" },
  ];

  if (!taskDetails) {
    return <div className="text-black">Loading...</div>;
  }

  return (
    <div className="mr-8 text-black border-gray-400 border overflow-x-auto bg-primary">
      <div className="p-2 w-full text-white font-semibold">Matriks Kraljic</div>
      <table className="min-w-full bg-white border-collapse">
        <tbody>
          <tr className="text-sm">
            <td className="align-top py-4 pl-10 w-1/2">
              <div className="space-y-4">
                {/* Project Name */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Project Name
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.projectname}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>

                {/* Project Code */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Project Code
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.projectcode}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>

                {/* Procurement / Subcontract */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Procurement / Subcontract
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.procurement}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>
              </div>
            </td>
            <td className="align-top py-4 pr-10 w-1/2">
              <div className="space-y-4">
                {/* Discipline */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Discipline
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.discipline}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>

                {/* Requisition / Subcontracting No */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Requisition / Subcontracting No.
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.requisitionno}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>

                {/* Scope of Work */}
                <div className="flex items-center h-12">
                  <label className="w-1/2 text-black font-semibold">
                    Scope of Work
                  </label>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={`:   ${taskDetails.scopeofwork}`}
                      readOnly
                      className="w-full border-none bg-transparent text-black"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="p-10">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className=" px-4 py-2 bg-white"></th>
                      <th className="border border-gray-500 px-4 py-2 font-medium">
                        Magnitude of Work
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Impact on Schedule
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Re-Purchase Possibility
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Complexity of Work
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Design Factors
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Supplier Performance Rating
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Approved Manufacturer List
                      </th>
                      <th className="border border-gray-500 font-medium px-4 py-2">
                        Materials of Construction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td className="bg-gray-200 border border-gray-500 px-4 py-2 w-20">
                          {row.point}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.magnitude}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.impact}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.repurchase}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.complexity}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.design}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.performance}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.supplier}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                          {row.materials}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          <tr className="text-sm">
            <td colSpan={2} className="py-4 px-10">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h2 className="text-black font-semibold text-base">
                    Form Penilaian
                  </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {formFields.map(({ label, field }) => (
                    <div
                      key={field}
                      className="grid grid-cols-12 items-center gap-4"
                    >
                      <div className="col-span-5 flex">
                        <label className="text-black flex-1">{label}</label>
                        <span className="text-black px-2">:</span>
                      </div>
                      <div className="col-span-7">
                        <RadioGroup
                          field={field}
                          value={formValues[field as keyof typeof formValues]}
                          onChange={handleChange}
                          disabled={isViewOnly}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="space-y-4 pt-4">
                    {[
                      {
                        label: "Supply Risk Score",
                        value:
                          supplyRiskScore !== null ? supplyRiskScore : "N/A",
                      },
                      {
                        label: "Business Impact Score",
                        value:
                          businessImpactScore !== null
                            ? businessImpactScore
                            : "N/A",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-12 items-center gap-4"
                      >
                        <div className="col-span-5 flex">
                          <label className="text-black font-semibold flex-1">
                            {item.label}
                          </label>
                          <span className="text-black px-2">:</span>
                        </div>
                        <div className="col-span-7">
                          <span className="text-black font-semibold">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 flex">
                        <label className="text-black font-semibold flex-1">
                          Category
                        </label>
                        <span className="text-black px-2">:</span>
                      </div>
                      <div className="col-span-7">
                        <span className="text-black font-semibold">
                          {productCategory !== null ? productCategory : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 flex">
                        <label className="text-black flex-1 font-semibold">
                          Pilihan Pengadaan
                        </label>
                        <span className="text-black px-2">:</span>
                      </div>
                      <div className="col-span-7">
                        {isViewOnly ? (
                          <span className="text-black font-semibold">
                            {selectedOption}
                          </span>
                        ) : (
                          <select
                            className="w-60 border border-gray-300 rounded p-2 bg-white"
                            value={selectedOption}
                            onChange={handleOptionChange}
                            disabled={productCategory === null}
                          >
                            <option value="" disabled>
                              Pilih Metode Pengadaan
                            </option>
                            {procurementOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {!isViewOnly && (
                      <ConfirmationModal 
                      onConfirm={handleConfirmSubmit}
                      isDisabled={!selectedOption || !productCategory}
                    />
                    )}
                  </div>
                </form>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const tableData = [
  {
    point: "Point 1",
    magnitude: "Significant scope and price (x > 10M)",
    impact:
      "Vital to the project success significant integrity-critical areas, very costly activities, repair impractical",
    repurchase: "None",
    complexity:
      "Large number of complex interfaces, highly dependent on numerous subcontractors",
    design: "New Innovative design approach with unproven results",
    performance:
      "Complex or critical item. Past Poor performance, history with the supply of engineering deliverables or finished product",
    supplier: "Only 1 Supplier",
    materials: "Exotic Alloy i.e Hastelloy, i.e. Inconel, i.e. Incolloy",
  },
  {
    point: "Point 2",
    magnitude: "Comparatively expansive in both scope and cost (5M < x < 10M)",
    impact:
      "On critical path numerous dependencies and integrity-critical aspects, repair impractical",
    repurchase: "Max 2 times re-purchase",
    complexity: "Novel or less proven numerous interfaces, many subcontractors",
    design:
      "Extrapolation of proven designs with limited reliability data or previous experience",
    performance:
      "Novel or less recent experience with supply of this item. Unique design, metallurgy, short schedule, or recent difficulty on similar items from this supplier",
    supplier: "2 - 3 Supplier",
    materials:
      "High Alloy i.e. Monel, i.e. Duplex Stainless Steel, i.e. HT Carbon Steel",
  },
  {
    point: "Point 3",
    magnitude: "Medium scope and cost (1M < x < 5M)",
    impact:
      "Limited float, could become critical path, some dependent processes, some integrity-critical aspects, repair possible but this significant impact",
    repurchase: "2-5 times re-purchase",
    complexity: "Some novelty, multiple disciplines and interfaces",
    design:
      "Simple modification to proven designs or systems with known reliability and past experience",
    performance: "Some novelty due to design conditions, metallurgy, schedule",
    supplier: "4 - 5 Supplier",
    materials: "Stainless Steel",
  },
  {
    point: "Point 4",
    magnitude: "Relatively small in scope and cost (x < 1M)",
    impact:
      "Schedule float available, few dependencies, few integrity-critical components, repair possible",
    repurchase: "More than 5 times re-purchase",
    complexity: "Familiar, proven, few interfaces, industry standard",
    design:
      "Frequently used and well-proven design with easily obtained replacement parts, simple processes",
    performance: "Standard vendor supplied item",
    supplier: "More than 5 Supplier",
    materials: "Carbon Steel Cast Iron",
  },
];
