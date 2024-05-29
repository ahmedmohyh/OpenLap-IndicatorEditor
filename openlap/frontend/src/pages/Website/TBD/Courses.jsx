import React, {useState} from 'react';
import {Box, Paper, Tab, Tabs, Typography} from '@mui/material';


const Courses = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, value) => {
    console.log(value)
    setValue(value);
  }

  return (
    <>
      <Paper elevation={0} sx={{p: 4}}>
        <Typography variant="h5" gutterBottom> Courses </Typography>
        <Paper square elevation={0}>
          <Tabs value={value} onChange={handleChange} indicatorColor="primary" variant="scrollable"
                scrollButtons="auto">
            <Tab label="Advanced Web Technologies"/>
            <Tab label="Learning Analytics"/>
            <Tab label="Lab - IDEA"/>
            <Tab label="Seminar - BDLA"/>
          </Tabs>
          <Box hidden={value !== 0} sx={{p: 2}}>
            <Typography gutterBottom>
              The World Wide Web and its underlying technologies are increasingly gaining importance for the development
              of interactive Web applications. This course introduces concepts, principles, and methods in current
              client and server-side Web technologies. Basic Web technologies such as HTML, CSS, JSON, JavaScript, etc.
              are a prerequisite to take this course. The focus of this course is rather on advanced topics in emerging
              Web technologies. These include extensions of Web standards, Web toolkits and development environments,
              current backend Web frameworks (e.g. Node/Express, Flask), frontend Web frameworks (e.g. Angular, React),
              and combination of different Web technologies (e.g. MEAN/MERN Stack, Dash). This course follows a
              student-centered and project-based learning approach. Web technologies will be presented in the lecture by
              student groups. The presented technologies are further investigated and applied in hands-on sessions as
              well as small student projects carried out throughout the course.
            </Typography>
            <Typography gutterBottom>
              Getting credits for this course requires a successful completion of all assignments, project, and oral
              exam at the end of the semester. The final grade will be calculated as follows: assignments and project
              (40%), student presentations including hands-on sessions (15%), class participation & group management /
              collaboration (12%), and oral exam (33%).
            </Typography>
          </Box>
          <Box hidden={value !== 1} sx={{p: 2}}>
            <Typography gutterBottom>
              Learning Analytics (LA) has attracted a great deal of attention as practitioners, institutions, and
              researchers are increasingly seeing the potential that LA has to shape the future technology-enhanced
              learning landscape. LA is an emerging data science field that represents the application of big data and
              analytics in education. It deals with the development of methods that harness educational data sets to
              support the learning process. LA is an interdisciplinary field involving competences from computer
              science, cognitive psychology, and pedagogy. It leverages various computer science methods. These include
              statistics, big data, machine learning, data/text mining, information visualization, visual analytics, and
              recommender systems. The first part of the course will provide a systematic overview on this emerging
              field and its key concepts through a reference model for LA based on four dimensions, namely data,
              environments, context (what?), stakeholders (who?), objectives (why?), and methods (how?). In the second
              part of this course, we will discuss various methods and techniques required to develop innovative LA
              systems, in relation to each dimension of the LA reference model. In the last part of the course, current
              topics and trends in LA research will be presented and discussed in invited talks. The presented methods
              and technologies will be further investigated and applied in small student projects carried out throughout
              the course. The course topics will include:
            </Typography>
            <Typography gutterBottom sx={{ml: 2}}>
              <li>Learning analytics and related areas (e.g. educational data mining)</li>
              <li>A reference model for learning analytics</li>
              <li>Big Data (Hadoop ecosystem)</li>
              <li>Learner modeling</li>
              <li>Ethics and privacy in learning analytics</li>
              <li>Assessment and feedback</li>
              <li>Recommender systems</li>
              <li>Information visualisation and visual analytics</li>
              <li>Social Network Analysis</li>
              <li>Current topics in learning analytics (invited lectures)</li>
            </Typography>
            <Typography gutterBottom>
              Getting credits for this course requires a successful completion of all assignments, project, and oral
              exam at the end of the semester. The final grade will be calculated as follows: assignments and project
              (50%) and oral exam (50%).
            </Typography>
          </Box>
          <Box hidden={value !== 2} sx={{p: 2}}>
            <Typography gutterBottom>
              The Interactive Data Exploration and Analytics (IDEA) lab course offered at the UDE Social Computing Group
              focuses on the effective integration of techniques from human-computer interaction (HCI), information
              visualization, and machine learning to help users interactively explore and visualize data.
            </Typography>
            <Typography gutterBottom>
              The aim of this semester's IDEA lab is to provide the foundation for an Exploratory Learning Analytics
              Toolkit for Students (ELAS) to support UDE students in their learning activities. In the previous
              iterations of the Learning Analytics (LA), Advanced Web Technologies (AWT), and Learning Analytics and
              Visual Analytics (LAVA) courses offered at the SoCo Group, different LA applications were developed as
              part of student projects (see the student projects section below). The task in this semester’s IDEA lab
              will be to improve, adapt, and integrate selected applications into the ELAS platform.
            </Typography>
            <Typography gutterBottom>
              You will organize yourselves into groups of 4-5 students. In the first few weeks of the lab, we will
              provide a general overview of the ELAS platform, introduce the Web technologies used in ELAS (e.g. React,
              Flask, Axios, MongoDB, visualization libraries), and give tutorials on how to get started with the
              project. There will be weekly project management meetings to answer your questions and guide you with
              additional materials. We will also have regular sessions where you will present the progress of your
              projects (ideas/concepts, prototypes, demos, end product).
            </Typography>
            <Typography gutterBottom>
              Grading for this lab will be based on the content and quality of the project (code, demos, presentations)
              as well as your performance (project management, collaboration, class participation, creativity) during
              the project.
            </Typography>
            <Typography gutterBottom>
              You will organize yourselves in groups of 4. In the first few weeks of the lab, we will provide a general
              overview on HCD and visualization libraries (e.g. D3.js). There will be weekly tasks which include:
            </Typography>
          </Box>
          <Box hidden={value !== 3} sx={{p: 2}}>
            <Typography gutterBottom>
              Big data is an umbrella term to cover various aspects of handling large amounts of data (volume)
              produced at a high speed (velocity) with a wide range of data types and sources (variety). The
              possibilities of big data continue to evolve rapidly, driven by innovation in the underlying
              technologies, platforms, and analytics capabilities. Learning analytics represent the application
              of big data and analytics in education. The most commonly cited definition of learning analytics
              which was adopted by the first international conference on learning analytics and knowledge
              (LAK11) is ”the measurement, collection, analysis and reporting of data about learners and their
              contexts, for purposes of understanding and optimizing learning and the environments in which it
              occurs”.
            </Typography>
            <Typography gutterBottom>
              This seminar will give insights about the state of the art in big data analytics and current research
              topics in learning analytics. Topics will include, but are not limited to:
            </Typography>
            <Typography gutterBottom sx={{ml: 2}}>
              <li>The Hadoop Ecosystem</li>
              <li>Big Data Storage</li>
              <li>Big Data Processing</li>
              <li>Big Data Visualization</li>
              <li>Visual Analytics</li>
              <li>Visual Interactive Recommender Systems</li>
              <li>Ethics and Privacy in Learning Analytics</li>
            </Typography>
            <Typography gutterBottom>
              The topics will be assigned in the kick-off meeting. We will provide one-two starting papers for each
              topic. The students will be asked to write a seminar paper (8-10 pages ACM style, a template will be
              provided) and prepare a 30 minute talk about one topic.
            </Typography>
            <Typography gutterBottom>
              After the seminar, the students will have some in-depth knowledge about one topic in big data and learning
              analytics and will have a good overview on other topics in this field. The seminar also gives students the
              opportunity to refine their scientific research and presentation skills. This seminar is highly
              recommended for students interested in doing their thesis projects on topics related to data science and
              learning technologies at the Social Computing Group.
            </Typography>
          </Box>
        </Paper>

      </Paper>
    </>
  );
}

export default Courses;
