
import React, { useState, useCallback } from 'react';
import { analyzePapers } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (files.length === 0) {
      setError('Please upload at least one paper image to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const imageParts = await Promise.all(
        files.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          };
        })
      );

      const result = await analyzePapers(imageParts);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check the console for details and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  return (
    <div className="min-h-screen bg-neutral-darkest font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <main className="mt-8">
          <div className="bg-gray-800/20 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 border border-white/10">
            <h2 className="text-xl md:text-2xl font-bold text-brand-accent mb-4">Upload Research Papers</h2>
            <p className="text-neutral-medium mb-6">
              Select images of the academic papers you want to compare and analyze.
            </p>
            <FileUploader onFilesSelected={handleFileChange} />
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading || files.length === 0}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Papers'}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800/20 rounded-2xl border border-white/10">
                <Spinner />
                <p className="mt-4 text-lg text-neutral-light animate-pulse">
                  AI is reading and comparing the papers... this may take a moment.
                </p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg animate-fade-in" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {analysis && (
               <div className="bg-gray-800/20 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 border border-white/10 animate-fade-in">
                 <h2 className="text-2xl md:text-3xl font-bold text-brand-accent mb-6 pb-2 border-b-2 border-brand-secondary">Analysis Results</h2>
                 <ResultsDisplay markdownContent={analysis} />
               </div>
            )}
            {!isLoading && !analysis && !error && files.length > 0 && (
                <div className="text-center p-8 bg-gray-800/20 rounded-2xl border border-dashed border-white/20">
                    <p className="text-neutral-medium">Ready to analyze {files.length} paper(s). Click the "Analyze Papers" button to begin.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
