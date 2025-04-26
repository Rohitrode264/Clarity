import { useEffect, useState, useRef } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isYouTubeURL } from '../utils/Validator';
import Loader from './Loader';

const API_KEY: string | undefined = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY ?? '');

export function CurrentURL() {
  const [url, setUrl] = useState<string | undefined>('');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      setUrl(tabs[0]?.url);
    });
  }, []);

  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
    }
  }, [summary]);

  const handleSummarize = async () => {
    if (!isYouTubeURL(url)) {
      setError("This is not a YouTube Video URL");
      return;
    }

    setError('');
    setSummary('');
    setLoading(true);

    try {
      const response = await YoutubeTranscript.fetchTranscript(url || '');
      const transcriptText = response.map(entry => entry.text).join(" ");
      const prompt = `Analyze the following YouTube video transcript and provide a clear, concise summary that captures the core message or purpose of the content. Use context and common sense to adapt the tone and style accordingly—treat it like a song if it's a song, a film if it's a film, or summarize it plainly if it's a typical video. The summary should be brief but insightful enough to serve as a stand-in for watching the full video. Avoid referencing the transcript or giving any indication that you're summarizing—it should read like a natural explanation of what the video is about.\n\n${transcriptText}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const chat = model.startChat();
      const result = await chat.sendMessageStream(prompt);

      for await (const chunk of result.stream) {
        const textChunk = chunk.text();
        for (let i = 0; i < textChunk.length; i++) {
          setSummary(prev => prev + textChunk[i]);
          await new Promise(resolve => setTimeout(resolve, 4)); // Smooth typing delay
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setSummary("Failed to fetch the summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-[360px] bg-gray-800 text-white p-6 pt-20 shadow-lg">
      <div className='border-b-2 border-gray-700 flex'>
        <h1 className="fixed top-0 left-0 right-0 text-xl font-semibold mb-4 p-7 text-gray-300 bg-gray-900 z-10">
          Clarity
        </h1>
      </div>

      <p className="flex justify-center text-sm mb-4 p-4 text-gray-400">
        Current URL: {url || 'Loading...'}
      </p>

      <button 
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full mb-2 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize this Video'}
      </button>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading && <Loader />}

      {summary && (
        <div
          ref={summaryRef}
          className="bg-gray-700 p-4 rounded-md w-full text-sm text-gray-300 min-h-[200px] max-h-[300px] overflow-y-auto transition-all"
        >
          <h2 className="font-medium mb-2 text-gray-200">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
