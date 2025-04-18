# OakleyRecognizer UI

A React‑based frontend for recognizing Oakley sunglasses models in images, powered by a private API.

## Overview

**OakleyRecognizer UI** is a single‑page application built with React that lets users upload an image of Oakley sunglasses and returns the exact model name. Under the hood, it communicates with [OakleyRecognizer‑API](https://github.com/allanVvz/OakleyRecognizer-API), a private Flask API that:

1. Downloads the **vzv1** Swin‑based machine learning model from an Amazon S3 bucket.
2. Runs inference on the uploaded image.
3. Returns the predicted Oakley frame model name.

You can view the live frontend on GitHub Pages:  
https://allanvvz.github.io/OakleyRecognizer-UI/


## Features

- **Image Upload**: Drag & drop or select an image file.
- **Real‑time Inference**: Sends the image to OakleyRecognizer‑API and displays the model name.
- **Responsive Design**: Works seamlessly on desktop and mobile.
- **GitHub Pages Deployment**: Frontend is hosted directly from the `gh-pages` branch.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 16
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- An instance of **OakleyRecognizer‑API** running and accessible (see its README).

### Installation

1. **Clone this repo**  
   ```bash
   git clone https://github.com/allanVvz/OakleyRecognizer-UI.git
   cd OakleyRecognizer-UI
License
This project is private. Please contact the maintainer for access or questions.

Built with ❤️ by AllanVvz
