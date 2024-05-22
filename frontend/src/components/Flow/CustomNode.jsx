import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  console.log("data", data);
  return (
    <>
      {/* {data.target && (
        <Handle
          type="target"
          position={Position[data.target]}
          isConnectable={isConnectable}
        />
      )} */}
      {data.target.length > 0 &&
        data.target.map((pos) => (
          <Handle
            type="target"
            position={Position[pos]}
            isConnectable={isConnectable}
            index={pos}
          />
        ))}

      <div className="bg-white h-full min-w-40 min-h-10 text-center text-black rounded-md">

          <div
            // style={{ backgroundColor: data.label ? data.color : white }}
            className={`w-full rounded-t-md px-6 ${
              data.type === "Wait"
                ? "bg-purple-200"
                : data.type === "Decision"
                ? "bg-green-200"
                : data.type === "Send Message"
                ? "bg-red-200"
                : "pt-2"
            }`}
          >
            {data.type}
          </div>

        {data.label}
      </div>

      {data.source && (
        <Handle
          type="source"
          position={Position[data.source]}
          isConnectable={isConnectable}
        />
      )}
    </>
  );
});
