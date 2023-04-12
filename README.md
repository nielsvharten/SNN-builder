# SNNBuilder

Build spiking neural networks from scratch in an intuitive UI and execute them on the fly with the [SNNSimulator](https://gitlab.socsci.ru.nl/snnsimulator/simsnn) (part of this repository).

## Requirements

1. nodejs & npm [(nvm)](https://github.com/nvm-sh/nvm#installing-and-updating)
2. this repository

## Create environment
### Option A: Conda environment
1. Create the Conda environment for this project in the project's root directory
```
conda env create --file environment.yml
```
2. Activate the created Conda environment
```
conda activate snn-builder
```
### Option B: Virtualenv 
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
## Set up frontend
```
cd frontend && npm install && cd ..
```

## Usage
1. Activate environment (venv or Conda)
2. Start UI and execution server from project's root directory
```
npm run dev --prefix frontend
```
