# 📘 Project Plan
--- 
## 1. Project Overview 
- **Project Name: Yummy Food Delivery and Ordering App** 
- **Team Members:**

| Name              | Student ID |   Role   |
|-------------------|------------|----------|
| Vu Thi Dieu Linh  |  23010545  |          |
| Ta Vuong Bao Ngoc |  23010644  |          |
| Nguyen Minh Sang  |  23010888  |          |
| Hoang Nhu Quynh   |  23010027  |          |

- **Course / Lab:** Software Architecture 
- **Instructor / Supervisor:** M.Sc. Vu Quang Dung
- **Project Description:**
Yummy is a food ordering and delivery app that offers a fast, convenient, and personalized experience. Users can search for restaurants, place orders, pay online, and track deliveries in real-time.
 
## 2. Project Goals
The project's primary objectives are to create a fast and convenient food ordering and delivery platform that simultaneously increases customer reach for restaurants/merchants. This requires building an efficient delivery management system for drivers and focusing on optimizing overall business performance through data and reporting. To enhance the user experience, the platform will also integrate chatbot and AI-based recommendations for users.

## 3. Scope
**3.1. Food ordering and purchasing operations**
The system is designed to focus on the customer experience and the seamless ordering process. Firstly, the system will allow customers to search for and select restaurants and dishes that meet their needs. Following selection, the platform will support the entire process of creating orders and confirming purchases easily and quickly. Finally, to ensure service accuracy, a crucial function is to ensure that order information is accurately transmitted to the restaurant, thereby initiating the preparation and delivery process.
**3.2. Restaurant Management Operations**
The system provides comprehensive tools for managing the list of restaurants participating in the platform. This management functionality extends to allowing restaurants to manage food item information, selling prices, and serving status (availability) for their offerings. Crucially, the platform enables restaurants to receive, process, and update order status from customers efficiently.
**3.3. Delivery Operations**
Effective delivery operations are maintained by the system's ability to distribute (assign) orders to suitable drivers. Following assignment, the platform must track the delivery process from order pickup to completion in real-time. This overall functionality is designed to ensure effective coordination between the restaurant and the driver, guaranteeing timely service.
**3.4. Payment Operations**
The system’s delivery operations focus on three key areas: distributing orders to suitable drivers, actively tracking the delivery process from order pickup to completion, and ultimately working to ensure effective coordination between the restaurant and the driver.
**3.5. Customer Care and Experience Operations**
To continuously improve service quality and user satisfaction, the platform is equipped to record customer ratings and feedback. Furthermore, the system is designed to support the resolution of issues arising related to orders. Finally, the platform leverages collected information to personalize the user experience based on behavioral data.
**3.6. Analysis and Reporting Operations**
The system's analytical capabilities are built to collect data on orders, revenue, and user behavior. This collected data is essential to support restaurants and the system in making informed business decisions. Ultimately, these operations provide a database for optimizing operations and facilitating system expansion.
**3.7. AI integration**


## 4. Requirements
**4.1. Functional Requirements**
**4.2. Non-functional Requirements**
---
## 5. Technology Survey
To assess the current situation and serve as a basis for drawing experience for building the new system, the team conducted a survey of popular food ordering and delivery applications today such as GrabFood, ShopeeFood, and Xanh SM. The survey results show that these applications all provide the full core functions of an order placement and delivery system, including searching for restaurants, viewing menus, selecting dishes, placing orders, online payment, and real-time order status tracking. Besides that, the system also supports order management for restaurants and drivers, allowing for the synchronized reception, processing, and updating of the delivery progress, while also integrating a rating and feedback function to improve service quality.
GrabFood and ShopeeFood both utilize microservices architecture, in which services such as user management, orders, payment, location tracking, promotions, and notifications are separated. This architecture helps the system to be easily scalable, independently deployable, and handle high load well during peak hours. However, the distributed architecture increases complexity in monitoring, logging, and inter-service error handling. Real-time data synchronization among users, drivers, and restaurants requires robust infrastructure and high operational costs.
Here is the translation of the paragraph:
GrabFood and ShopeeFood both integrate AI at various levels. AI is used to suggest dishes and restaurants based on ordering history, predict demand according to time and area, and optimize driver dispatch. The advantages of integrating AI are increased successful order rates, improved personalized experience, and optimized operational efficiency.
Regarding performance and scalability, GrabFood demonstrates high stability, efficiently handling a large volume of simultaneous orders. ShopeeFood has the ability to scale quickly thanks to its existing e-commerce infrastructure, but order status updates sometimes experience latency. Regarding security, both platforms require a high level of protection for personal data and payment transactions. However, user experience (usability) remains an area that needs improvement as the systems become increasingly complex, featuring many functions but lacking simplicity and consistency.
From the analyses and evaluations of existing systems, it can be seen that ShopeeFood and GrabFood have built relatively complete food ordering and delivery platforms with a full range of core functions and effective operating models. Therefore, the system proposed in this project will inherit and retain the functions that have proven effective, while simultaneously focusing on improving the existing weaknesses, especially regarding user experience and the level of personalization. On that basis, the system aims to simplify the interface, reduce complexity in the usage process, and develop additional smart features, notably the integration of a chatbot to support consultation and suggest dishes according to the user's taste and needs. The ultimate goal is to build a more user-friendly, easier-to-use food ordering and delivery application that provides an optimal experience for users, restaurants, and drivers alike.
---
## 6. Implementation Plan

