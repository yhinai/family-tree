import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

// Family data
const FAMILY_DATA = {
  name: "العائلة",
  children: [
    {
      name: "جمعة",
      children: [
        { name: "حمدان" },
        { name: "هناء" },
        { name: "هزاع" },
        { name: "هالة" },
        { name: "هاجر" },
        { name: "سالم" },
        { name: "يوسف" },
        { name: "محمد" }
      ]
    },
    {
      name: "سعيد",
      children: [
        { name: "يحيى" },
        { name: "سالم" },
        { name: "مريم" },
        { name: "احمد" }
      ]
    },
    {
      name: "حمد",
      children: [
        { name: "سالم" },
        { name: "حياة" },
        { name: "امير" },
        { name: "زوينة" },
        { name: "دانة" },
        { name: "العهد" },
        { name: "أمين" },
        { name: "عبدالله" },
        { name: "الوليد" },
        { name: "احمد" },
        { name: "امل" },
        { name: "المهدي" }
      ]
    },
    {
      name: "محمد",
      children: [
        { name: "سالم" },
        { name: "عسى" },
        { name: "عبد العزيز" },
        { name: "عمران" },
        { name: "طارق" }
      ]
    },
    {
      name: "علي",
      children: [
        { name: "زوينة" },
        { name: "تغاريد" },
        { name: "زهور" },
        { name: "سالم" }
      ]
    },
    {
      name: "عائشة",
      children: [
        { name: "سلطان" },
        { name: "عبدالله" },
        { name: "راشد" },
        { name: "أسماء" },
        { name: "محمد" }
      ]
    },
    {
      name: "نصراء",
      children: [
        { name: "لمك" },
        { name: "جهينة" },
        { name: "سالم" },
        { name: "بثينة" },
        { name: "عبدالملك" },
        { name: "مكية" },
        { name: "مالك" },
        { name: "محمد" }
      ]
    },
    {
      name: "شيخة",
      children: [
        { name: "سعود" },
        { name: "ميرة" },
        { name: "محمد" },
        { name: "مروة" },
        { name: "فيصل" },
        { name: "عمر" }
      ]
    },
    {
      name: "فاطمة",
      children: [
        { name: "بدر" },
        { name: "براءة" },
        { name: "ريم" },
        { name: "رائد" },
        { name: "هبة" },
        { name: "ثريا" }
      ]
    },
    {
      name: "ميثاء",
      children: [
        { name: "نوف" },
        { name: "حمد" },
        { name: "نور" },
        { name: "ريم" },
        { name: "أية" },
        { name: "مريم" }
      ]
    }
  ]
};

// Constants for layout configuration
const CONFIG = {
  childrenPerRow: 3,
  nodeSpacing: 120,
  minHorizontalSpacing: 80,
  minVerticalSpacing: 50,
  verticalRowSpacing: 160,
  childVerticalSpacing: 80,
  // nodesPerRow will be calculated dynamically based on screen width
  getNodesPerRow: (width) => {
    if (width < 480) return 1; // Mobile phones
    if (width < 768) return 2; // Tablets (portrait)
    if (width < 1024) return 3; // Tablets (landscape) and small laptops
    return 4; // Desktops and large screens
  }
};

const AdvancedFamilyTree = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'radial'
  const [infoVisible, setInfoVisible] = useState(false);

  // Create zoom controller with useCallback to avoid re-creation on re-renders
  const createZoomBehavior = useCallback((svg) => {
    return d3.zoom()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
        setZoomLevel(event.transform.k.toFixed(1));
      });
  }, []);

  // Handler for resetting view - now properly used in UI
  const resetView = useCallback(() => {
    if (!svgRef.current) return;
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    const resetScale = 0.65;
    const zoom = createZoomBehavior(d3.select(svgRef.current).select("g"));
    
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(containerWidth/2, containerHeight/2).scale(resetScale)
      );
    
    setZoomLevel(resetScale);
  }, [createZoomBehavior]);

  // Toggle view between tree and radial - now used in UI
  const toggleView = useCallback(() => {
    setViewMode(prev => prev === 'tree' ? 'radial' : 'tree');
    setSelectedNode(null);
  }, []);

  // Helper function to create SVG gradients and filters
  const createDefs = (svg) => {
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
      
    return defs;
  };

  // Function to position nodes in tree layout
  const positionNodesInTreeLayout = (root, containerWidth) => {
    // Position first generation nodes (uncles and aunts) in rows
    const firstGenNodes = root.children;
    
    // Position first generation nodes in rows - responsive to container width
    const nodesPerRow = CONFIG.getNodesPerRow(containerWidth);
    
    firstGenNodes.forEach((node, i) => {
      const row = Math.floor(i / nodesPerRow);
      const col = i % nodesPerRow;
      
      // Center the nodes by using full width and calculating offsets
      const totalRowWidth = containerWidth * 0.9;
      const nodeSpacing = totalRowWidth / nodesPerRow;
      
      // Calculate horizontal position to center the entire row
      const rowStartX = (containerWidth - totalRowWidth) / 2 + nodeSpacing / 2;
      
      // Set positions with centered, evenly distributed spacing
      node.x = rowStartX + col * nodeSpacing;
      node.y = 150 + row * 500; // Keep large vertical spacing between rows
    });
    
    // Position children under their parents
    firstGenNodes.forEach((parentNode) => {
      if (!parentNode.children || parentNode.children.length === 0) return;
      
      const childrenCount = parentNode.children.length;
      
      // Position children in rows beneath their parent
      parentNode.children.forEach((childNode, i) => {
        const row = Math.floor(i / CONFIG.childrenPerRow);
        const col = i % CONFIG.childrenPerRow;
        
        // Set consistent spacing for all children
        const nodeWidth = CONFIG.nodeSpacing;
        const childRowWidth = Math.min(childrenCount - row * CONFIG.childrenPerRow, CONFIG.childrenPerRow) * nodeWidth;
        
        // Center children directly under their parent
        const startX = parentNode.x - childRowWidth / 2 + nodeWidth / 2;
        
        // Set child positions with even spacing
        childNode.x = startX + col * nodeWidth;
        childNode.y = parentNode.y + CONFIG.verticalRowSpacing + row * CONFIG.childVerticalSpacing;
      });
    });
    
    // Resolve node overlaps
    resolveNodeOverlaps(root);
  };

  // Function to resolve node overlaps
  const resolveNodeOverlaps = (root) => {
    const allNodes = root.descendants();
    const secondGenNodes = allNodes.filter(node => node.depth === 2);
    
    // Detect and fix overlaps - several passes to ensure resolution
    for (let pass = 0; pass < 3; pass++) {
      // Check for overlaps within second generation
      for (let i = 0; i < secondGenNodes.length; i++) {
        for (let j = i + 1; j < secondGenNodes.length; j++) {
          const nodeA = secondGenNodes[i];
          const nodeB = secondGenNodes[j];
          
          // Skip if they have the same parent (siblings)
          if (nodeA.parent === nodeB.parent) continue;
          
          // Check for potential overlap
          const horizontalDist = Math.abs(nodeA.x - nodeB.x);
          const verticalDist = Math.abs(nodeA.y - nodeB.y);
          
          // If too close, adjust positions
          if (horizontalDist < CONFIG.minHorizontalSpacing && verticalDist < CONFIG.minVerticalSpacing) {
            // Calculate adjustment values
            const horizontalAdjust = (CONFIG.minHorizontalSpacing - horizontalDist) / 2 + 5;
            const verticalAdjust = (CONFIG.minVerticalSpacing - verticalDist) / 2 + 5;
            
            // Decide which direction to move - prefer horizontal when possible
            if (horizontalDist < verticalDist) {
              // Move horizontally
              if (nodeA.x < nodeB.x) {
                nodeA.x -= horizontalAdjust;
                nodeB.x += horizontalAdjust;
              } else {
                nodeA.x += horizontalAdjust;
                nodeB.x -= horizontalAdjust;
              }
            } else {
              // Move vertically
              if (nodeA.y < nodeB.y) {
                nodeA.y -= verticalAdjust;
                nodeB.y += verticalAdjust;
              } else {
                nodeA.y += verticalAdjust;
                nodeB.y -= verticalAdjust;
              }
            }
          }
        }
      }
    }
  };

  // Draw tree links with nice curves
  const createTreeLinks = (svg, root) => {
    return svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d => {
        // Calculate control points for a graceful curve
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        
        // For custom positioning, use Bezier curves
        return `M${sourceX},${sourceY}
                C${sourceX},${sourceY + (targetY - sourceY) * 0.4}
                 ${targetX},${sourceY + (targetY - sourceY) * 0.6}
                 ${targetX},${targetY}`;
      })
      .attr("fill", "none")
      .attr("stroke", "#b8c2cc")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);
  };

  // Draw radial links
  const createRadialLinks = (svg, root) => {
    return svg.selectAll(".link")
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
  };

  // Create node groups with proper attributes
  const createNodes = (svg, root, viewMode, setSelectedNode) => {
    return svg.selectAll(".node")
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
  };

  // Add node backgrounds with styling
  const addNodeBackgrounds = (nodes) => {
    return nodes.append("rect")
      .attr("rx", 6) // Rounded corners
      .attr("ry", 6)
      .attr("x", d => {
        const width = d.depth === 0 ? 110 : d.depth === 1 ? 100 : 90;
        return -width / 2;
      })
      .attr("y", -15)
      .attr("width", d => d.depth === 0 ? 110 : d.depth === 1 ? 100 : 90)
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
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#drop-shadow)")
      .attr("class", "node-rect");
  };

  // Add node labels
  const addNodeLabels = (nodes) => {
    return nodes.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .attr("fill", d => d.depth < 2 ? "#ffffff" : "#333333")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", d => {
        if (d.depth === 0) return 14; // Root node
        if (d.depth === 1) return 12; // First generation 
        return 11; // Second generation
      })
      .attr("font-weight", d => d.depth < 2 ? "bold" : "normal");
  };

  // Add node interactivity - calculate appropriate zoom level based on screen size
  const addNodeInteractivity = (nodes, svg, zoom, containerWidth, containerHeight, viewMode) => {
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
          .attr("stroke-width", 1.5);
        
        // Reset connections
        svg.selectAll(".link")
          .transition()
          .duration(300)
          .attr("stroke", "#b8c2cc")
          .attr("stroke-width", viewMode === 'tree' ? 1 : 1.5)
          .attr("opacity", viewMode === 'tree' ? 0.7 : 0.8);
      })
      .on("click", function(event, d) {
        // Calculate zoom factor based on screen width
        const zoomFactor = containerWidth < 768 ? 1.2 : 1.5;
        
        // Center and zoom to the clicked node
        const transform = viewMode === 'tree'
          ? d3.zoomIdentity.translate(containerWidth / 2 - d.x, containerHeight / 2 - d.y).scale(zoomFactor)
          : d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2)
              .scale(zoomFactor)
              .translate(-Math.sin(d.x) * d.y, Math.cos(d.x) * d.y);
              
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoom.transform, transform);
          
        setZoomLevel(zoomFactor);
      });
  };

  // Add animation effects to nodes and links
  const addAnimationEffects = (nodes, links) => {
    // Node animations
    nodes.attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 30)
      .ease(d3.easeCubicOut)
      .attr("opacity", 1);
      
    // Link animations  
    links.attr("stroke-dasharray", function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke-dashoffset", function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 20)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);
  };

  // Initial tree rendering with responsive zoom levels
  const setupInitialZoom = (svgSelection, zoom, containerWidth, containerHeight) => {
    setTimeout(() => {
      // More granular responsive scaling based on screen width
      let initialScale;
      let translateX, translateY;
      
      // Determine scale and translation based on screen size
      if (containerWidth < 480) {
        // Mobile phones
        initialScale = 0.4;
        translateX = containerWidth * 0.5;
        translateY = 50;
      } else if (containerWidth < 768) {
        // Tablets (portrait)
        initialScale = 0.5;
        translateX = containerWidth * 0.3;
        translateY = 40;
      } else if (containerWidth < 1200) {
        // Tablets (landscape) and small laptops
        initialScale = 0.6;
        translateX = containerWidth * 0.2;
        translateY = 35;
      } else {
        // Desktops and large screens
        initialScale = 0.75;
        translateX = containerWidth * 0.1;
        translateY = 30;
      }
      
      const initialTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(initialScale);
        
      svgSelection
        .call(zoom.transform, initialTransform);
      
      setZoomLevel(initialScale.toFixed(1));
    }, 100);
  };

  // Main effect to create and update the visualization
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Handle window resize
    const handleResize = () => {
      // Trigger redraw when window dimensions change significantly or
      // when the number of nodes per row would change based on width
      const currentNodesPerRow = CONFIG.getNodesPerRow(window.innerWidth);
      const previousNodesPerRow = CONFIG.getNodesPerRow(previousWidth);
      
      if (Math.abs(window.innerWidth - previousWidth) > 100 ||
          Math.abs(window.innerHeight - previousHeight) > 100 ||
          currentNodesPerRow !== previousNodesPerRow) {
        
        previousWidth = window.innerWidth;
        previousHeight = window.innerHeight;
        
        // Force a re-render by toggling the view mode and back
        setViewMode(prev => {
          setTimeout(() => setViewMode(prev), 0);
          return prev === 'tree' ? 'temp' : 'tree';
        });
      }
    };
    
    // Store previous dimensions
    let previousWidth = window.innerWidth;
    let previousHeight = window.innerHeight;
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get container dimensions
    const containerWidth = window.innerWidth || 1200;
    const containerHeight = window.innerHeight || 800;

    // Create hierarchy
    const root = d3.hierarchy(FAMILY_DATA);
    
    // Set layout based on view mode
    let layout;
    if (viewMode === 'tree') {
      layout = d3.tree()
        .size([containerWidth * 0.95, containerHeight * 0.75]);
    } else {
      layout = d3.cluster()
        .size([2 * Math.PI, Math.min(containerWidth, containerHeight) / 2 - 120]);
    }
    
    // Assign coordinates to nodes
    layout(root);

    // Position nodes in tree layout
    if (viewMode === 'tree') {
      positionNodesInTreeLayout(root, containerWidth);
    }

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, containerWidth, containerHeight])
      .append("g");
      
    // Position SVG based on view mode
    if (viewMode === 'tree') {
      svg.attr("transform", `translate(0, 0)`);
    } else {
      svg.attr("transform", `translate(${containerWidth/2}, ${containerHeight/2})`);
    }

    // Create gradient definitions and filters
    createDefs(svg);

    // Create links based on view mode
    const links = viewMode === 'tree' 
      ? createTreeLinks(svg, root)
      : createRadialLinks(svg, root);

    // Create nodes
    const nodes = createNodes(svg, root, viewMode, setSelectedNode);

    // Add node backgrounds
    addNodeBackgrounds(nodes);

    // Add node labels
    addNodeLabels(nodes);

    // Create zoom behavior
    const zoom = createZoomBehavior(svg);

    // Add interactivity to nodes
    addNodeInteractivity(nodes, svg, zoom, containerWidth, containerHeight, viewMode);

    // Add animations
    addAnimationEffects(nodes, links);

    // Setup zoom behavior
    const svgSelection = d3.select(svgRef.current);
    svgSelection.call(zoom);
    
    // Set initial zoom for tree view
    if (viewMode === 'tree') {
      setupInitialZoom(svgSelection, zoom, containerWidth, containerHeight);
    }
    
    // Store the current svgRef for cleanup
    const currentSvgRef = svgRef.current;
    
    // Cleanup function
    return () => {
      if (currentSvgRef) {
        d3.select(currentSvgRef).on('.zoom', null);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode, createZoomBehavior]);

  // Toggle info panel visibility
  const toggleInfoPanel = () => {
    setInfoVisible(!infoVisible);
  };

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-lg shadow-md flex flex-col sm:flex-row gap-2">
        <button 
          onClick={resetView}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Reset View
        </button>
        <button 
          onClick={toggleView}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Toggle View: {viewMode === 'tree' ? 'Tree' : 'Radial'}
        </button>
        <button 
          onClick={toggleInfoPanel}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          {infoVisible ? 'Hide Info' : 'Show Info'}
        </button>
        <div className="text-xs mt-1 sm:mt-0 text-gray-600">
          Nodes per row: {CONFIG.getNodesPerRow(window.innerWidth)}
        </div>
      </div>
      
      {/* Info Panel */}
      {infoVisible && selectedNode && (
        <div className="absolute top-16 right-4 z-10 bg-white p-3 rounded-lg shadow-md w-64">
          <h3 className="font-bold mb-2">{selectedNode.name}</h3>
          <p className="text-sm">Type: {selectedNode.level}</p>
          {selectedNode.children > 0 && (
            <p className="text-sm">Children: {selectedNode.children}</p>
          )}
          <p className="text-sm mt-2">Zoom Level: {zoomLevel}x</p>
        </div>
      )}
      
      {/* Main Visualization */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" className="cursor-move"></svg>
      </div>
    </div>
  );
};

export default AdvancedFamilyTree;