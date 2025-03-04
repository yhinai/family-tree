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

    // Get container dimensions
    const containerWidth = svgRef.current.clientWidth || 1000;
    const containerHeight = 800;

    // Create hierarchy
    const root = d3.hierarchy(data);
    
    // Define layout based on view mode
    let layout;
    if (viewMode === 'tree') {
      layout = d3.tree()
        .size([containerWidth - 100, containerHeight - 160]);
    } else {
      layout = d3.cluster()
        .size([2 * Math.PI, Math.min(containerWidth, containerHeight) / 2 - 120]);
    }
    
    // Assign x and y coordinates to each node
    layout(root);

    // Create the SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
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

    // Add node backgrounds
    nodes.append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("x", d => d.depth === 2 ? -45 : -60)
      .attr("y", -15)
      .attr("width", d => d.depth === 2 ? 90 : 120)
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
    <div className="w-full h-full flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Family Tree</h1>
      <p className="text-gray-600 mb-4">Interactive visualization with advanced features</p>
      
      {/* Control Panel */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-3 mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={resetView}
            className="mr-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200"
          >
            Reset View
          </button>
          <button
            onClick={toggleView}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white transition-colors duration-200"
          >
            Switch to {viewMode === 'tree' ? 'Radial' : 'Tree'} View
          </button>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Zoom:</span>
          <div className="px-3 py-1 bg-gray-100 rounded-md text-gray-700">
            {zoomLevel}x
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl flex gap-4">
        {/* Main Visualization */}
        <div className="flex-grow bg-white rounded-xl shadow-md p-4 overflow-hidden">
          <div className="w-full overflow-auto relative" style={{ height: "600px" }}>
            <svg ref={svgRef} width="100%" height="600" className="cursor-move"></svg>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="w-64 bg-white rounded-xl shadow-md p-4 h-600">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-3">Family Details</h3>
          
          {selectedNode ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{selectedNode.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Generation</p>
                <p className="font-medium text-gray-800">{selectedNode.level}</p>
              </div>
              
              {selectedNode.depth < 2 && (
                <div>
                  <p className="text-sm text-gray-500">Children</p>
                  <p className="font-medium text-gray-800">{selectedNode.children}</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                Click on a family member to center the view on them.
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm italic">
              Hover over a family member to see their details.
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-md bg-teal-500 mr-2"></div>
                <span className="text-gray-700 text-sm">Root</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-md bg-blue-500 mr-2"></div>
                <span className="text-gray-700 text-sm">Uncles & Aunts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-md bg-gray-200 mr-2"></div>
                <span className="text-gray-700 text-sm">Children</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl text-center mt-4 text-sm text-gray-500">
        Scroll to zoom, drag to pan, click on nodes to focus
      </div>
    </div>
  );
};

export default AdvancedFamilyTree;