# OpenLAP Indicator Engine

<p align="center">
<a href="https://www.uni-due.de/soco/research/projects/openlap.php" target="_blank" rel="noopener noreferrer">
<img width=75%  src="docs/img/openlap-logo.svg" alt="openlap logo">
</a>
</p>

Open Learning Analytics (OLA) is an emerging field, that deals with learning data collected from various environments and contexts, analyzed with a wide range of analytics methods to address the requirements of different stakeholders. OLA introduces a set of requirements and implications for LA practitioners, developers, and researchers. These include data aggregation and integration, interoperability, reusability, modularity, flexibility, extensibility, performance, scalability, usability, privacy, and personalization. The Open Learning Analytics Platform (OpenLAP) is a framework that addresses these issues and lays the foundation for an ecosystem of OLA.

OpenLAP provides a detailed technical OLA architecture with a concrete implementation of all its components, seamlessly integrated into a platform. It encompasses different stakeholders associated through a common interest in learning analytics but with diverse needs and objectives, a wide range of data coming from various learning environments and contexts, as well as multiple infrastructures and methods that enable to draw value from data in order to gain insight into learning processes.

OpenLAP follows a user-centric approach to engage end-users in flexible definition and dynamic generation of personalized indicators. The generated indicators are executed by querying data, applying filters, performing analysis, and generating visualizations to be rendered on the client-side. To meet the requirements of diverse users, OpenLAP provides a modular and extensible architecture that allows the easy integration of new analytics modules, analytics methods, and visualization techniques.


## 🚀 Get Started with Indicator Engine

### Prerequisites

Download and install the following softwares

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=windows). IntelliJ IDEA is used to develop the server.

- [Node v16.14.2 (LTS)](https://nodejs.org/en/blog/release/v16.14.2/). NodeJS is used to run the frontend application.

- [Github Desktop](https://desktop.github.com/). Github Desktop is used to clone the repository.

### Run the server 

- Clone the repository using Github Desktop.

- Open the project `openlap-indicatorengine` using IntelliJ IDEA.

- Open the terminal (located at the bottom-left corner) and run the following command to install the node packages.

	```bash
	npm ci
	```
	- If you get an error, try running the following command.

		```bash
		npm install
		```

- Make a copy of the `.env.example` file, located inside the `openlap-indicatorengine` folder, and rename it to `.env`.

- Run the following command in the terminal to start the server.

	```bash
	npm start
	```

- Open the browser and go to the following URL.

	```bash
	http://localhost:3000
	```