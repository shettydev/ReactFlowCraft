import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Workflow from "./WorkFlow";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getEachGraphQuery } from "@/src/api/graph";

export default function Flow() {
  const { graphId } = useParams();

  const { isLoading, data, isFetching } = graphId
    ? getEachGraphQuery(graphId)
    : { isLoading: false, data: null, isFetching: false };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNode = (newNode) => {
    // Update the nodes state with the new node
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  return (
    <div className="w-full h-[c]">
      <div className="w-full flex justify-between">
        <Box height={"92vh"} width="80%" border="1px solid lightgrey">
          <Workflow
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            edges={edges}
            setEdges={setEdges}
            graphId={graphId}
            isLoading={isLoading}
            isFetching={isFetching}
            data={data}
          />
        </Box>
        <Box width="20%">
          <Sidebar
            addNode={addNode}
            setNodes={setNodes}
            nodes={nodes}
            edges={edges}
            isLoading={isLoading}
            isFetching={isFetching}
            data={data}
          />
        </Box>
      </div>
    </div>
  );
}
