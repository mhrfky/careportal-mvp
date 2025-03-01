// pages/zod-test.tsx
import { useState } from "react";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

export default function ZodTest() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse({ email });
      setResult("Email is valid!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setResult(error.errors[0].message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Zod Validation Test</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setResult("");
          }}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Validate Email
        </button>
      </form>
      {result && <p className="mt-4 text-xl text-center">{result}</p>}
    </div>
  );
}
