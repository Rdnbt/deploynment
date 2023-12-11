import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import vocabularyData from './data/vocabulary';
import { firestore } from '../../services/firebase';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faBars } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const VocabularyGraph = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [wordsList, setWordsList] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const zoom = useRef(d3.zoom().scaleExtent([0.5, 2]));
  const [detailCardOpacity, setDetailCardOpacity] = useState(0);
  const [activeNode, setActiveNode] = useState(null);
  const navigate = useNavigate()
  const handleHomeClick = () => {
    navigate("/"); // Navigates to the home route
  };
  const fetchWordsFromFirestore = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, 'words'));
    setWordsList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, []);

  // State for subject selection and data
  const [selectedSubject, setSelectedSubject] = useState('biology'); // default subject
  const [subjectData, setSubjectData] = useState(null);

  // Handle subject selection change
  const handleSubjectChange = async (event) => {
    const subject = event.target.value;
    setSelectedSubject(subject);

    // Dynamically import the JSON data based on the selected subject
    const data = await import(`./data/${subject}.json`);
    setSubjectData(data.default);
  };

  useEffect(() => {
    fetchWordsFromFirestore();
  }, [fetchWordsFromFirestore]);

// Node styles with hover effect
  const nodeStyle = {
    transition: 'transform 0.3s ease', // Smooth transition for scale-up
  };
  
  useEffect(() => {
    const svgElement = svgRef.current;
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight - 50;

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        d3.select(svgElement).select('g').attr('transform', event.transform);
      });

    svgElement.innerHTML = '';
    const svg = d3.select(svgElement)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .call(zoomBehavior)
      .append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);
    
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const simulation = d3.forceSimulation(vocabularyData.nodes)
      .force('link', d3.forceLink(vocabularyData.links).id(d => d.word).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(0, 0))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const drag = d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const link = svg.append('g')
      .selectAll('line')
      .data(vocabularyData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(vocabularyData.nodes)
      .join('circle')
      .attr('r', 40)
      .attr('fill', '#23C3B4')
      .call(drag)
      .on("mouseover", function(event, d) {
        d3.select(event.target)
          .transition()
          .style('transform-origin', 'center center')
          .duration(300)
          .attr("r", 48) // Increase radius by a scale of 1.2
          .attr("fill", '#7960E8'); // Change color
      })
      .on("mouseout", function(event, d) {
        d3.select(event.target)
          .transition()
          .duration(300)
          .attr("r", 40) // Reset radius
          .attr("fill", '#23C3B4')// Reset color
          .attr('transform', '');
      })
      .on('click', (event, d) => {
        // Start fade-out for the currently displayed detail card
        setDetailCardOpacity(0);

        // Set a timeout to allow the fade-out effect to complete before updating the node
        setTimeout(() => {
          setSelectedNode(d);

          // Start fade-in for the new detail card
          setDetailCardOpacity(1);
        }, 300); // Should match the transition duration
      }, [subjectData]); 


      const labels = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(vocabularyData.nodes)
      .join('text')
      .text(d => d.word)
      .attr('x', 0)
      .attr('y', 40)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels.attr('x', d => d.x)
        .attr('y', d => d.y + 4);
    });

    return () => {
      // Cleanup on component unmount
      simulation.stop();
    };
  }, []);

  const zoomIn = useCallback(() => {
    d3.select(svgRef.current).transition().call(zoom.current.scaleBy, 1.5);
  }, []);

  const zoomOut = useCallback(() => {
    d3.select(svgRef.current).transition().call(zoom.current.scaleBy, 0.67);
  }, []);

  const addToFirestore = useCallback(async (node) => {
    if (wordsList.some(word => word.word === node.word)) {
      alert('This word already exists in the database.');
      return;
    }
    try {
      const docRef = await addDoc(collection(firestore, 'words'), {
        word: node.word,
        detail: node.detail,
        example: node.example,
      });
      setSelectedNode({ ...node, id: docRef.id });
      fetchWordsFromFirestore();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }, [wordsList, fetchWordsFromFirestore]);

  const deleteFromFirestore = useCallback(async (id) => {
    try {
      await deleteDoc(doc(firestore, 'words', id));
      fetchWordsFromFirestore();
      if (selectedNode && selectedNode.id === id) {
        setSelectedNode(null);
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }, [selectedNode, fetchWordsFromFirestore]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Mobile-specific styles
  const sidebarStyle = {
    marginTop: '60px',
    backgroundColor: '#f0f0f0',
    height: '100vh',
    left: 0,
    overflow: 'hidden',
    padding: '20px',
    position: 'absolute',
    top: 0,
    transform: `translateX(${showSidebar ? 0 : '-100%'})`,
    transition: 'transform 0.3s',
    width: '80%',
    zIndex: 100,
  };

  const graphContainerStyle = {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center', // Centers children horizontally in the container
    width: '100%',
    marginBottom: '0', // Ensure there's no bottom margin
    alignItems: 'center',
  };

  // Adjust the z-index of the sidebar toggle to ensure it's always visible
  const detailCardStyle = {
    marginTop: '300px',
    position: 'absolute', // Position it absolutely relative to its parent
    top: '50%', // 50% from the top of the parent
    left: '50%', // 50% from the left of the parent
    transform: 'translate(-50%, -50%)', // This will center the card
    maxWidth: '350px', // Maximum width of the card
    width: '90%', // Use a percentage width for responsiveness
    padding: '20px', // Padding inside the card
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    opacity: 1,
    transition: 'opacity 1.0s ease', // Smooth transition for fade-in
    zIndex: 10, // Ensure it's above other elements
    // ...other styles you may need
  };

  // SVG container styles
  const svgContainerStyle = {
    position: 'relative', // Positioning context for zoom buttons
    alignItems: 'center',
    textAlign: 'center', // Center the SVG
    //margin: '0', // Provide some spacing
    // Adjust height to be SVG height + button height, ensuring no overlap
    // This is an example, adjust the height based on actual SVG and button size
  };

  // Adjusted SVG styles
  const svgStyle = {
    display: 'block', // Allows centering within the text-align of the parent
    maxWidth: '800px',
    maxHeight: '600px',
    width: '350px', // Responsive width
    height: '380px', // Maintain aspect ratio
    border: '1px solid black',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  };

  // Defining the zoom button styles
  const zoomButtonStyle = {
    position: 'absolute', // Position within the SVG container
    backgroundColor: '#f0f0f0',
    color: '#000',
    cursor: 'pointer',
    fontSize: '16px', // Reduced size
    position: 'fixed',
    borderRadius: '4px', // Updated for a rectangular shape
    width: '30px', // Specify a width for the rectangle
    height: '30px', // Specify a height for the rectangle 
  };

  // Adjust the zoom button styles to position them at the top right corner of the window
  const zoomInButtonStyle = {
    ...zoomButtonStyle,
    position: 'absolute',
    top: '10px', // Move to top
    right: '30px', // Align to right
  };

  const zoomOutButtonStyle = {
    ...zoomButtonStyle,
    position: 'absolute',
    top: '50px', // Place below the zoom in button
    right: '30px',
  };

  // Adjust the z-index of the sidebar toggle to ensure it's always visible
  const toggleButtonStyle = {
    ...zoomButtonStyle, // Reuse the existing zoomButtonStyle as a base
    marginTop: '60px',
    zIndex: 200, // Higher z-index to ensure visibility
    top: '10px', // Adjust the position to top left
    left: '10px',
  };

  // Styles for the home icon
  const homeIconStyle = {
    marginTop: '60px',
    position: 'fixed',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };
  
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="d-flex justify-content-between align-items-center p-3">
        {/* Moved toggle bar to top left corner */}
        

        <div className="container-fluid py-3 mt-4 align-center"> {/* Added Bootstrap responsive container */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 text-center"> {/* Adjust grid layout for responsiveness */}
              <select className="form-select" onChange={handleSubjectChange} value={selectedSubject}>
                <option value="biology">Biology</option>
                <option value="computerScience">Computer Science</option>
                {/* Add more options for additional subjects */}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle and Instruction Text in a flex container */}
      <div className="d-flex justify-content-between align-items-center p-3">
      {/* Sidebar Toggle on the left */}
      <img 
        src={`${process.env.PUBLIC_URL}/wordlist.png`} 
        alt="Sidebar Toggle" 
        onClick={toggleSidebar} 
        className="sidebar-toggle" 
        style={toggleButtonStyle} 
      />

      {/* Centered Instruction Text */}
      <div className="text-center flex-grow-1" style={{ opacity: 1, transition: 'opacity 0.3s ease' }}>
        <strong>Click on the word</strong>
      </div>

      {/* Placeholder for right alignment */}
      <div style={{ width: toggleButtonStyle.width }}></div>
    </div>



      {/* Sidebar */}
      <div className="sidebar bg-light" style={sidebarStyle}>
        <h6 className="px-3 pt-2 mt-3">Stored Words</h6>
        <div className="list-group list-group-flush">
          {wordsList.map((word) => (
            <div key={word.id} className="list-group-item d-flex justify-content-between align-items-center">
              {word.word}
              <FontAwesomeIcon icon={faTrash} onClick={() => deleteFromFirestore(word.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Graph container */}
      <div className="graph-container" style={graphContainerStyle}>
        <svg ref={svgRef} className="border rounded" style={svgStyle}></svg>
        <button style={zoomInButtonStyle} onClick={zoomIn}>+</button>
        <button style={zoomOutButtonStyle} onClick={zoomOut}>-</button>
      </div>

      {/* Detail card */}
      {selectedNode && (
        <div className="detail-card bg-light p-3 border rounded" style={detailCardStyle}>
          <h5><strong>Word:</strong> {selectedNode.word}</h5>
          <p><strong>Definition:</strong> {selectedNode.detail}</p>
          <p><strong>Example:</strong> {selectedNode.example}</p>
          <FontAwesomeIcon icon={faPlus} onClick={() => addToFirestore(selectedNode)} />
        </div>
      )}
    </div>
  );
};

export default VocabularyGraph;