import React from "react";
import { motion } from "framer-motion";

const SummaryInfo = ({ summaryInfoData }) => {
  if (summaryInfoData === undefined) {
    return <div>Loading summary info...</div>;
  }
  const { total, clientes_con_compra, efectividad, cobertura, drop, ref, frec } = summaryInfoData;
  const formatNumber = (value) => {
    return value !== undefined ? value.toLocaleString("de-DE") : "";
  };

  return (
    <div className="flex flex-col items-center mt-10 mb-20 mx-24" style={{ color: "black" }}>
      <div className="grid grid-cols-1 gap-20 justify-center items-center">
        {/* Total de productos */}
        <motion.div
          whileHover={{ scale: 1.2, transition: { duration: 0.6 } }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col border-3 p-10 rounded"
          style={{ borderColor: "pink" }}
        >
          <div>
            <div className="flex items-center justify-center">
              <div className="font-medium text-secondary leading-5">Total de productos</div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-2xl font-bold tracking-tight leading-none">{formatNumber(total)}</div>
            </div>
          </div>
        </motion.div>

        {/* Clientes con Compra y Efectividad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
          <motion.div
            whileHover={{ scale: 1.2, transition: { duration: 0.6 } }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col border-3 p-10 rounded"
          >
            <div className="flex items-center justify-center">
              <div className="font-medium text-secondary leading-5 text-center">Clientes con Compra</div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-2xl font-bold tracking-tight leading-none">{formatNumber(clientes_con_compra)}</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.2, transition: { duration: 0.6 } }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col border-3 p-10 rounded"
          >
            <div className="flex items-center justify-center">
              <div className="font-medium text-secondary leading-5">Efectividad</div>
            </div>
            <div className="flex justify-center mt-8">
              <div className="text-2xl font-bold tracking-tight leading-none">{formatNumber(efectividad)}%</div>
            </div>
          </motion.div>
        </div>

        {/* Compra Promedio */}
        <motion.div
          whileHover={{ scale: 1.1, transition: { duration: 0.6 } }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col border-3 p-10 rounded"
        >
          <div className="flex items-center justify-center">
            <div className="font-medium text-secondary leading-5">Compra Promedio</div>
          </div>
          <div className="flex items-center mt-8 justify-around items-center">
            <div className="grid grid-cols-1 grid-cols-3 gap-12">
              <div className="flex flex-col items-center w-full">
                <div className="text-1xl font-bold leading-none">Drop</div>
                <div className="text-xl text-lg leading-none">{drop?.toFixed(3)}</div>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="text-1xl font-bold leading-none">Ref</div>
                <div className="text-xl text-lg leading-none">{ref}</div>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="text-1xl font-bold leading-none">Frec</div>
                <div className="text-xl text-lg leading-none">{frec}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SummaryInfo;
