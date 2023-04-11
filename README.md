# SNNBuilder

Build spiking neural networks from scratch

## Requirements

1. nodejs & npm [(nvm)](https://github.com/nvm-sh/nvm#installing-and-updating)
2. this repository

## Installation with Conda
1. Create the Conda environment for this project in the project's root directory
```
conda env create --file environment.yml
```
2. Activate the created Conda environment
```
conda activate snn-builder
```
## Installation with virtual environment
1. Create a virtual environment (called venv) in the project's root directory
```
pip install virtualenv
virtualenv venv
```
2. Activate the created virtual environment:
  - Windows: ```./venv/Scripts/activate```
  - Linux/Mac: ```./venv/bin/activate```
3. Install dependencies for the execution server
```
pip install flask flask_cors networkx numpy matplotlib
```
## Usage

1. Start UI from project's root directory
```
serve -s frontend/build
```
2. Start execution server from project's root directory
```
flask --app backend/app run
```
