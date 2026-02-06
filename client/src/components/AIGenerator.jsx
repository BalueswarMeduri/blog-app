import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { showToast } from "../helper/showToast"; // Assuming you have this helper

// Initialize Gemini
// WARNING: Store this in your .env file as VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI("AIzaSyDuUDFdCgOK_BLL_VnRCqOV-hDuySdEnyk"); 

const AIGenerator = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    try {
      setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      // We explicitly ask for HTML format to play nicely with CKEditor
      const enhancedPrompt = `Write a detailed blog paragraph based on this topic: "${prompt}". Format the output with basic HTML tags (p, strong, ul, li) suitable for a rich text editor. Do not include markdown backticks.`;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      // Pass data back to parent
      onGenerate(text);
      
      showToast("success", "Content generated successfully!");
      setOpen(false); // Close modal
      setPrompt(""); // Reset prompt
    } catch (error) {
      console.error("AI Error:", error);
      showToast("error", "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="gap-2 cursor-pointer text-primary">
          <Sparkles size={16} />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI Content Assistant</DialogTitle>
          <DialogDescription>
            Enter a short topic or outline, and Gemini will write a paragraph for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="E.g., Explain the benefits of React hooks..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" className="cursor-pointer" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} className="cursor-pointer" disabled={loading || !prompt}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerator;