import { Check, Send, Timer } from "lucide-react";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      {data.target && (
        <Handle
          type="target"
          position={Position[data.target]}
          isConnectable={isConnectable}
        />
      )}

      {/* For multiple targets */}
      {/* {!!data.target &&
        data.target.length > 0 &&
        data.target.map((pos) => (
          <Handle
            type="target"
            position={Position[pos]}
            isConnectable={isConnectable}
            index={pos}
          />
        ))} */}

      <div className="bg-white h-full min-w-40 min-h-10 text-center text-black rounded-md">
        {data.type && (
          <div
            // style={{ backgroundColor: data.label ? data.color : white }}
            className={`w-full flex justify-center items-center rounded-t-md px-4 ${
              data.type === "Wait"
                ? "bg-purple-200 py-2"
                : data.type === "Decision"
                ? "bg-green-200 py-2"
                : data.type === "Send"
                ? "bg-red-200 py-2"
                : "pt-2"
            }`}
          >
            {data.type}{" "}
            {data.type === "Send" ? (
              <Send className="ml-2 h-4 w-4" />
            ) : data.type === "Wait" ? (
              <Timer className="ml-2 h-4 w-4" />
            ) : data.type === "Decision" ? (
              <Check className="ml-2 h-4 w-4" />
            ) : null}
          </div>
        )}
        <div className="py-2 max-w-72 px-4">{data.label}</div>
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
