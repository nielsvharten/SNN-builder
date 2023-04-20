# SNNBuilder

Build spiking neural networks from scratch in an intuitive UI and execute them on the fly with the [SNNSimulator](https://gitlab.socsci.ru.nl/snnsimulator/simsnn) (part of this repository).

## Getting started as a user
### 1) Requirements

1. Python with [pip](https://pypi.org/project/pip/)
2. The build repository

### 2) Create environment
#### Option A: Virtualenv 
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
pip install -r requirements.txt
```
#### Option B: Conda environment
1. Create the Conda environment for this project in the project's root directory
```
conda env create --file environment.yml
```
2. Activate the created Conda environment
```
conda activate snn-builder
```

### 3) Usage
1. Activate environment (venv or Conda)
2. Start the application from the project's root directory
```
python start.py
```

## Getting started as a developer
### 1) Requirements
1. Python with [pip](https://pypi.org/project/pip/)
2. nodejs & npm [(nvm)](https://github.com/nvm-sh/nvm#installing-and-updating)
3. The development repository

### 2) Create environment
#### Option A: Virtualenv 
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
pip install -r requirements.txt
```
#### Option B: Conda environment
1. Create the Conda environment for this project in the project's root directory
```
conda env create --file environment.yml
```
2. Activate the created Conda environment
```
conda activate snn-builder
```

### 3) Set up frontend
```
cd frontend && npm install && cd ..
```

### 4) Usage
1. Activate environment (venv or Conda)
2. Start UI and execution server from project's root directory
```
npm run dev --prefix frontend
```
