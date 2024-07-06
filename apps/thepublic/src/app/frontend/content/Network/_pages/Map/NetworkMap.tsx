import React, { useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { getNetworkGraphData } from './networkService'; // Assuming you have a service fetching network graph data
import styles from './networkmap.module.scss'; // Ensure there's a corresponding SCSS module

interface Node {
  id: string;
  name: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const NetworkMap: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const data = await getNetworkGraphData();
        setGraphData(data);
      } catch (error) {
        setError('Failed to fetch network data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) {
    return <div>Loading network data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.networkMapContainer}>
      <h1>Network Mapper</h1>
      {graphData ? (
        <div className={styles.graph}>
          <ForceGraph3D
            graphData={graphData}
            nodeAutoColorBy="group"
            linkWidth={2}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={d => Math.random() * 0.01 + 0.002}
          />
        </div>
      ) : (
        <div>No network data available.</div>
      )}
    </div>
  );
};

export default NetworkMap;