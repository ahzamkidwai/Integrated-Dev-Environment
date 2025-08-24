# unicodeX - Online Code Editor

![Logo](/public/images/HomePage.png)

## About The Project

unicodeX is a web-based IDE built with **Next.js** that allows users to run code directly in the browser without installing any IDE or text editor. Users can also download their code. The app supports **C++, C, Python, Java, and JavaScript**. It is hosted on **Vercel** and is **serverless**, using **AWS Lambda** for code execution.

## Tools & Packages Used

**Tools:** Next.js, Tailwind CSS, AWS, Vercel  
**Packages:** 
- `@monaco-editor/react`  
- `axios`  
- `js-file-download`  
- `react-hot-toast`  
- `react-icons`  
- `react-select`  
- `react-spinners`  

## Live Demo

[Frontend Hosted on Vercel](https://rce70.vercel.app)

## Main Features

- Multiple language support: **JavaScript, Python, C++, C, Java**  
- Three editors: **Code Editor**, **Input Editor**, **Output Editor**  
- Run code via **Run button** or **Alt + Enter**  
- Reset code using **Reset button**  
- Download code using **Download button**

## Thought Behind The Project

- Researchers can test code in a **safe, isolated environment**.  
- Developers can quickly test snippets without setting up a local IDE.  
- Teachers and students can experiment with code in **online courses or tutorials**.

## How It Works

1. User writes code in the **Code Editor**.  
2. User provides input in the **Input Editor**.  
3. User clicks **Run** or presses **Alt + Enter**.  
4. Code is sent to the server, which generates a **random file name** and executes it with the respective compiler/interpreter (10-second timeout).  
5. Server returns **output**, **error messages** (if any), and **execution time**.  
6. Client displays results in the **Output Editor**.

## Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ahzamkidwai/unicodeX.git
