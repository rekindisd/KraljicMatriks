"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiRoutes } from "@/API/routes";
import axios from "axios";

interface Project {
  projectid: number;
  projectcode: number;
  projectname: string;
  discipline: string;
  projectrole: string;
}

export default function ProjectTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects...");
        const response = await axios.get(apiRoutes.projects.main);
        console.log("Response:", response);
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-4 mt-32">
      <table className="w-full bg-white border border-gray-400 text-sm">
        <thead className="border border-gray-400 font-normal bg-primary">
          <tr className="py-2 px-4 text-white border border-gray-400">
            <th className="border-gray-400 border py-2 w-32 font-normal">
              Project Code
            </th>
            <th className="border-gray-400 border py-2 font-normal">
              Project Name
            </th>
            <th className="border-gray-400 border py-2 font-normal">
              Discipline
            </th>
            <th className="border-gray-400 border py-2 font-normal">Role</th>
            <th className="border-gray-400 border py-2 font-normal">Action</th>
          </tr>
        </thead>
        <tbody className="border-gray-400 border">
          {projects.map((project) => (
            <tr
              key={project.projectid}
              className="border-black border text-black text-sm"
            >
              <td className="border-gray-400 border align-middle pl-2 py-2">
                {project.projectcode}
              </td>
              <td className="border-gray-400 border align-middle pl-2 py-2">
                {project.projectname}
              </td>
              <td className="border-gray-400 border align-middle pl-2 py-2">
                {project.discipline}
              </td>
              <td className="border-gray-400 border align-middle pl-2 py-2">
                {project.projectrole}
              </td>
              <td className="border-gray-400 border text-center align-middle py-2">
                <Link
                  href={`/${project.projectid}`}
                  className="text-blue-500 hover:text-blue-300 px-2 py-1"
                >
                  ENTER
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
