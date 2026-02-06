import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { showToast } from "../helper/showToast";
import { decode } from "entities";

// Initialize Gemini from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBqXjkeIdh5GOugIit9_KR2OVfDJt9y2cg");

const AISummarizer = ({ content }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!content) return;

    try {
      setLoading(true);

      const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

      const prompt = `
Summarize the following blog content in simple and clear language.
Return 5–6 bullet points.
Do not use markdown.
Content:
${decode(content)}
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setSummary(text);
      showToast("success", "Summary generated!");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2 ">
          <Sparkles size={18} className="text-primary" />
          AI Summary
        </h3>

        <Button
          size="sm"
          variant="outline"
          onClick={handleSummarize}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {summary ? (
        <div className="text-sm whitespace-pre-line text-muted-foreground">
          {summary}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Click <b>Generate</b> to get a quick AI-powered summary of this blog.
        </p>
      )}
    </div>
  );
};

export default AISummarizer;
