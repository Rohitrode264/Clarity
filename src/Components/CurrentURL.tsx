import { useEffect, useState } from 'react';
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

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      setUrl(tabs[0]?.url);
    });
  }, []);

  const handleSummarize = async () => {
    if (!isYouTubeURL(url)) {
      setError("This is not a YouTube Video URL");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await YoutubeTranscript.fetchTranscript(url || '');
      const transcriptText = response.map(entry => entry.text).join(" ");
      const prompt = `Summarize the following YouTube transcript track and use your intelligence. If it's a song, treat it like a song; if it's a movie, treat it like a movie. Otherwise, summarize it naturally. The response should be concise enough that reading it is a reliable option over watching the video. Lastly, the user shouldn't know you're summarizing the transcript:\n\n${transcriptText}`;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const chat = model.startChat();
      const result = await chat.sendMessage(prompt);
      const geminiResponse = await result.response.text();
      setSummary(geminiResponse);
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

      <p className="flex justify-center text-sm mb-4 p-4 text-gray-400">Current URL: {url || 'Loading...'}</p>
      <button 
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full mb-2 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleSummarize}
      >
        Summarize this Video
      </button>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      {loading && <Loader />} 

      {summary && (
        <div className="bg-gray-700 p-4 rounded-md w-full text-sm text-gray-300 min-h-[200px]">
          <h2 className="font-medium mb-2 text-gray-200">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
