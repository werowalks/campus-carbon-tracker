import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#22c55e',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#16a34a',
    lineColor: '#475569',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#e2e8f0',
    background: '#ffffff',
    mainBkg: '#ffffff',
    nodeBorder: '#64748b',
    clusterBkg: '#f1f5f9',
    titleColor: '#0f172a',
    edgeLabelBackground: '#ffffff',
    textColor: '#0f172a',
    nodeTextColor: '#0f172a',
    attributeBackgroundColorOdd: '#f8fafc',
    attributeBackgroundColorEven: '#ffffff',
  },
  er: {
    diagramPadding: 20,
    layoutDirection: 'TB',
    minEntityWidth: 150,
    minEntityHeight: 75,
    entityPadding: 15,
    useMaxWidth: true,
    fontSize: 14,
  },
});

const MermaidDiagram = ({ chart, className = '' }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        try {
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = `<pre class="text-red-500">Error rendering diagram</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-x-auto ${className}`}
    />
  );
};

export default MermaidDiagram;
