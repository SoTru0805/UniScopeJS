"use client";

import { useState } from "react";
import { ReviewForm } from "@/components/review-form";

interface UnitDetailPageProps {
  params: {
    unitCode: string;
  };
}

export default function UnitDetailPage({ params }: UnitDetailPageProps) {
  const [open, setOpen] = useState(false);
  const { unitCode } = params;

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">{unitCode}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setOpen(true)}
      >
        Review this unit
      </button>
      <ReviewForm unitCode={unitCode} open={open} setOpen={setOpen} />
    </div>
  );
}