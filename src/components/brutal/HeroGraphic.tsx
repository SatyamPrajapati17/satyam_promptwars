"use client";

import React from "react";
import { motion } from "motion/react";

export function HeroGraphic() {
  return (
    <div className="w-full max-w-lg mx-auto aspect-4/3 bg-white border-[3px] border-black shadow-[8px_8px_0_#000] p-6 relative overflow-hidden flex flex-col justify-between select-none">
      <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-gray-500">
        SYS.DECISION_AUDIT_V1
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-black text-[#FFE600] border-2 border-black p-3 font-mono font-bold text-xs uppercase shadow-[3px_3px_0_#000] flex items-center justify-between"
      >
        <span>[ORIGINAL DECISION]</span>
        <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5">
          UNEXAMINED
        </span>
      </motion.div>

      <svg
        className="w-full h-16 my-1"
        viewBox="0 0 400 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M200 0 V24 M200 24 H70 V64 M200 24 H330 V64"
          stroke="#000000"
          strokeWidth="3"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </svg>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#FFE600] border-2 border-black p-2.5 shadow-[3px_3px_0_#000]"
        >
          <div className="text-[10px] font-mono font-bold text-black uppercase">
            HIDDEN ASSUMPTION
          </div>
          <p className="text-xs font-bold text-black mt-1 leading-snug">
            &ldquo;Industry brand equals mentorship quality.&rdquo;
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-[#7DD3FC] border-2 border-black p-2.5 shadow-[3px_3px_0_#000]"
        >
          <div className="text-[10px] font-mono font-bold text-black uppercase">
            EVIDENCE GAP
          </div>
          <p className="text-xs font-bold text-black mt-1 leading-snug">
            No talk with past interns about actual workload.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="mt-3 bg-white border-2 border-black p-2 shadow-[3px_3px_0_#000] flex items-center justify-between"
      >
        <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase">
          → CONVERTED TO EVIDENCE ACTION
        </span>
        <span className="text-[10px] font-bold bg-[#6EE7A8] text-black px-1.5 py-0.5 border border-black">
          READY TO VERIFY
        </span>
      </motion.div>
    </div>
  );
}

