import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <ProjectForm isEdit={false} />
        </div>
      </main>
    </div>
  );
}
