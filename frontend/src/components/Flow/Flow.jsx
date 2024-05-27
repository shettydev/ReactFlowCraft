import { Box, useDisclosure } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Workflow from "./WorkFlow";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEachGraphQuery } from "@/src/api/graph";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditNode } from "./EditNode";

export default function Flow() {
  const { graphId } = useParams();

  const { isLoading, data, isFetching } = graphId
    ? getEachGraphQuery(graphId)
    : { isLoading: false, data: null, isFetching: false };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [editText, setEditText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [selectedNode]);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setEditText(node.data.label);
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const handleSave = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: editText } }
          : node
      )
    );
    setSelectedNode(null);
    setEditText("");
    setOpen(false)
  };

  const addNode = (newNode) => {
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  return (
    <>
      <div className="w-full h-full">
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
              onNodeClick={onNodeClick}
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
              onNodeClick={onNodeClick}
            />
          </Box>
        </div>
      </div>
      {selectedNode && (
        <EditNode
          editText={editText}
          handleTextChange={handleTextChange}
          handleSave={handleSave}
          setOpen={setOpen}
          open={open}
        />
      )}
    </>
  );
}
