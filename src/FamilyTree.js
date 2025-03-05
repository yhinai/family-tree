import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const AdvancedFamilyTree = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'radial'

  useEffect(() => {
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Family data
    const data = {
      name: "Family Root",
      children: [
        {
          name: "Uncle Jumaa",
          children: [
            { name: "Hamdan" },
            { name: "Hana" },
            { name: "Hazza" },
            { name: "Hala" },
            { name: "Hajar" },
            { name: "Salem" },
            { name: "Youssef" },
            { name: "Mohammed" }
          ]
        },
        {
          name: "Uncle Saeed",
          children: [
            { name: "Yahya" },
            { name: "Salem" },
            { name: "Mariam" },
            { name: "Ahmed" }
          ]
        },
        {
          name: "Uncle Hamad",
          children: [
            { name: "Salem" },
            { name: "Hayat" },
            { name: "Amir" }
          ]
        },
        {
          name: "Aunt Zawina",
          children: [
            { name: "Dana" },
            { name: "Al-Hahd" },
            { name: "Amin" }
          ]
        },
        {
          name: "Uncle Abdullah",
          children: [
            { name: "Al-Walid" },
            { name: "Ahmed" },
            { name: "Amal" },
            { name: "Al-Mahdi" }
          ]
        },
        {
          name: "Uncle Mohammed",
          children: [
            { name: "Salem" },
            { name: "Asa" },
            { name: "Abdulaziz" },
            { name: "Imran" },
            { name: "Tariq" }
          ]
        },
        {
          name: "Uncle Ali",
          children: [
            { name: "Zawina" },
            { name: "Taghreed" },
            { name: "Zahoor" },
            { name: "Salem" }
          ]
        },
        {
          name: "Aunt Aisha",
          children: [
            { name: "Sultan" },
            { name: "Abdullah" },
            { name: "Rashid" },
            { name: "Asma" },
            { name: "Mohammed" }
          ]
        },
        {
          name: "Aunt Nasra",
          children: [
            { name: "Lamak" },
            { name: "Jahina" },
            { name: "Salem" },
            { name: "Bathina" },
            { name: "Abdulmalik" },
            { name: "Makkiyah" },
            { name: "Malik" },
            { name: "Mohammed" }
          ]
        },
        {
          name: "Aunt Sheikha",
          children: [
            { name: "Saud" },
            { name: "Mira" },
            { name: "Mohammed" },
            { name: "Marwa" },
            { name: "Faisal" },
            { name: "Omar" }
          ]
        },
        {
          name: "Aunt Fatima",
          children: [
            { name: "Bader" },
            { name: "Baraa" },
            { name: "Reem" },
            { name: "Raed" },
            { name: "Hiba" },
            { name: "Thuraya" }
          ]
        },
        {
          name: "Aunt Maytha",
          children: [
            { name: "Nawf" },
            { name: "Hamad" },
            { name: "Noor" },
            { name: "Reem" },
            { name: "Aya" },
            { name: "Mariam" }
          ]
        }
      ]
    };

    // Get container dimensions - use the full window size
    const containerWidth = window.innerWidth || 1200;
    const containerHeight = window.innerHeight || 800;

    // Create hierarchy
    const root = d3.hierarchy(data);
    
    // Modified layout to allow more space and prevent overlapping
    let layout;
    if (viewMode === 'tree') {
      // Use nodeSize instead of overall size to prevent overlapping
      layout = d3.tree()
        .nodeSize([150, 120]); // Increase horizontal spacing between nodes
    } else {
      layout = d3.cluster()
        .size([2 * Math.PI, Math.min(containerWidth, containerHeight) / 2 - 120]);
    }
    
    // Assign x and y coordinates to each node
    layout(root);

    // For tree layout, adjust second generation positions to prevent overlap
    if (viewMode === 'tree') {
      // Group nodes by their parent
      const parentMap = new Map();
      root.descendants().forEach(node => {
        if (node.depth === 2) { // Second generation
          const parentId = node.parent.data.name;
          if (!parentMap.has(parentId)) {
            parentMap.set(parentId, []);
          }
          parentMap.get(parentId).push(node);
        }
      });
      
      // For each parent, adjust children positions if needed
      parentMap.forEach((children, parentId) => {
        if (children.length > 1) {
          // Sort children by their original x position
          children.sort((a, b) => a.x - b.x);
          
          // Calculate how many children to place per row
          const maxPerRow = 3; // Adjust as needed
          const rows = Math.ceil(children.length / maxPerRow);
          
          for (let i = 0; i < children.length; i++) {
            const row = Math.floor(i / maxPerRow);
            const col = i % maxPerRow;
            const node = children[i];
            
            // Original x position of the parent
            const parentX = node.parent.x;
            
            // Offset from parent position
            const xOffset = (col - (Math.min(children.length, maxPerRow) - 1) / 2) * 160;
            
            // Update node position
            node.x = parentX + xOffset;
            node.y = node.parent.y + 180 + row * 100; // Vertical stacking
          }
        }
      });
    }

    // Create the SVG element - make it fill the entire container
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, containerWidth, containerHeight])
      .append("g");
      
    if (viewMode === 'tree') {
      svg.attr("transform", "translate(50, 50)");
    } else {
      svg.attr("transform", `translate(${containerWidth/2}, ${containerHeight/2})`);
    }

    // Create a gradient for nodes
    const defs = svg.append("defs");
    
    // Node gradient
    const nodeGradient = defs.append("linearGradient")
      .attr("id", "nodeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    
    nodeGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3498db");
    
    nodeGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2980b9");
    
    // Root gradient
    const rootGradient = defs.append("linearGradient")
      .attr("id", "rootGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    
    rootGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#16a085");
    
    rootGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1abc9c");
    
    // Leaf gradient
    const leafGradient = defs.append("linearGradient")
      .attr("id", "leafGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    
    leafGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8f9fa");
    
    leafGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e9ecef");
      
    // Selected node gradient
    const selectedGradient = defs.append("linearGradient")
      .attr("id", "selectedGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    
    selectedGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f39c12");
    
    selectedGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e67e22");

    // Filter for drop shadow
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");
    
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 3)
      .attr("result", "offsetBlur");
    
    const feComponentTransfer = filter.append("feComponentTransfer")
      .attr("in", "offsetBlur")
      .attr("result", "offsetBlur");
    
    feComponentTransfer.append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.2);
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Create links (paths between nodes)
    if (viewMode === 'tree') {
      svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d => {
          return `M${d.source.x},${d.source.y}
                  C${d.source.x},${(d.source.y + d.target.y) / 2}
                   ${d.target.x},${(d.source.y + d.target.y) / 2}
                   ${d.target.x},${d.target.y}`;
        })
        .attr("fill", "none")
        .attr("stroke", "#b8c2cc")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.8);
    } else {
      svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d => {
          return d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y)(d);
        })
        .attr("fill", "none")
        .attr("stroke", "#b8c2cc")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.8);
    }

    // Create the node groups
    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (d, i) => `node-${i}`)
      .attr("data-depth", d => d.depth)
      .attr("transform", d => {
        if (viewMode === 'tree') {
          return `translate(${d.x}, ${d.y})`;
        } else {
          return `translate(${Math.sin(d.x) * d.y}, ${-Math.cos(d.x) * d.y})`;
        }
      });

    // Function to measure text width - needed for second generation
    const getTextWidth = (text, fontSize) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${fontSize}px Arial, sans-serif`;
      return context.measureText(text).width;
    };

    // Add node backgrounds with dynamic width based on text length for second generation
    nodes.append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", d => {
        if (d.depth === 2) {
          const textWidth = getTextWidth(d.data.name, 12);
          return -Math.max(textWidth/2 + 20, 45); // Ensure minimum width
        }
        return d.depth === 0 ? -60 : -60;
      })
      .attr("y", -15)
      .attr("width", d => {
        if (d.depth === 2) {
          const textWidth = getTextWidth(d.data.name, 12);
          return Math.max(textWidth + 40, 90); // Ensure minimum width
        }
        return 120;
      })
      .attr("height", 30)
      .attr("fill", d => {
        if (d.depth === 0) return "url(#rootGradient)";
        if (d.depth === 1) return "url(#nodeGradient)";
        return "url(#leafGradient)";
      })
      .attr("stroke", d => {
        if (d.depth === 0) return "#16a085";
        if (d.depth === 1) return "#2980b9";
        return "#d1d5db";
      })
      .attr("stroke-width", 1)
      .attr("filter", "url(#drop-shadow)")
      .attr("class", "node-rect");

    // Add node labels
    nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .attr("fill", d => d.depth < 2 ? "#ffffff" : "#333333")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", d => d.depth === 0 ? 14 : 12)
      .attr("font-weight", d => d.depth < 2 ? "bold" : "normal");

    // Add node animations and interactivity
    nodes
      .on("mouseover", function(event, d) {
        // Highlight the node
        d3.select(this).select("rect")
          .transition()
          .duration(300)
          .attr("filter", "none")
          .attr("transform", "scale(1.1)")
          .attr("stroke-width", 2);
        
        // Highlight direct connections
        svg.selectAll(".link")
          .filter(link => link.source === d || link.target === d)
          .transition()
          .duration(300)
          .attr("stroke", "#3498db")
          .attr("stroke-width", 2.5)
          .attr("opacity", 1);
          
        // Update the info panel
        setSelectedNode({
          name: d.data.name,
          depth: d.depth,
          children: d.children ? d.children.length : 0,
          level: d.depth === 0 ? "Root" : d.depth === 1 ? "First Generation" : "Second Generation"
        });
      })
      .on("mouseout", function(event, d) {
        // Reset node
        d3.select(this).select("rect")
          .transition()
          .duration(300)
          .attr("filter", "url(#drop-shadow)")
          .attr("transform", "scale(1)")
          .attr("stroke-width", 1);
        
        // Reset connections
        svg.selectAll(".link")
          .transition()
          .duration(300)
          .attr("stroke", "#b8c2cc")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.8);
      })
      .on("click", function(event, d) {
        // Center and zoom to the clicked node
        const transform = viewMode === 'tree'
          ? d3.zoomIdentity.translate(containerWidth / 2 - d.x, containerHeight / 2 - d.y).scale(1.5)
          : d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2)
              .scale(1.5)
              .translate(-Math.sin(d.x) * d.y, Math.cos(d.x) * d.y);
              
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoom.transform, transform);
          
        setZoomLevel(1.5);
      });

    // Add initial animation
    nodes.attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 20)
      .attr("opacity", 1);
      
    svg.selectAll(".link")
      .attr("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke-dashoffset", function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 15)
      .attr("stroke-dashoffset", 0);

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
        setZoomLevel(event.transform.k.toFixed(1));
      });

    d3.select(svgRef.current)
      .call(zoom);

  }, [viewMode]);

  // Function to reset the view
  const resetView = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(viewMode === 'tree' ? 50 : svgRef.current.clientWidth/2, 
                                 viewMode === 'tree' ? 50 : svgRef.current.clientHeight/2)
                 .scale(1)
      );
    setZoomLevel(1);
  };

  // Toggle view between tree and radial
  const toggleView = () => {
    setViewMode(viewMode === 'tree' ? 'radial' : 'tree');
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-1 absolute top-0 left-4 z-10">Family Tree</h1>
      
      {/* Control Panel - Now positioned absolute in top right */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-sm p-2 flex gap-2 z-10">
        <button 
          onClick={resetView}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 text-sm"
        >
          Reset View
        </button>
        <button
          onClick={toggleView}
          className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors duration-200 text-sm"
        >
          {viewMode === 'tree' ? 'Radial' : 'Tree'} View
        </button>
        <div className="flex items-center ml-2">
          <span className="mr-1 text-gray-600 text-sm">Zoom:</span>
          <div className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-sm">
            {zoomLevel}x
          </div>
        </div>
      </div>
      
      {/* Info Panel - Now positioned absolute in bottom right */}
      <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-md p-3 w-56 z-10">
        <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 text-sm">Family Details</h3>
        
        {selectedNode ? (
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-medium text-gray-800 text-sm">{selectedNode.name}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Generation</p>
              <p className="font-medium text-gray-800 text-sm">{selectedNode.level}</p>
            </div>
            
            {selectedNode.depth < 2 && (
              <div>
                <p className="text-xs text-gray-500">Children</p>
                <p className="font-medium text-gray-800 text-sm">{selectedNode.children}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-xs italic">
            Hover over a family member to see their details.
          </div>
        )}
        
        <div className="mt-4 pt-2 border-t">
          <h4 className="font-medium text-gray-700 mb-1 text-xs">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-md bg-teal-500 mr-2"></div>
              <span className="text-gray-700 text-xs">Root</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-md bg-blue-500 mr-2"></div>
              <span className="text-gray-700 text-xs">Uncles & Aunts</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-md bg-gray-200 mr-2"></div>
              <span className="text-gray-700 text-xs">Children</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Visualization - Takes full screen */}
      <div className="w-full h-full overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="cursor-move"></svg>
      </div>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-1 rounded-full">
        Scroll to zoom, drag to pan, click on nodes to focus
      </div>
    </div>
  );
};

export default AdvancedFamilyTree;
