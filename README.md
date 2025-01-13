# TableRally

Welcome to **TableRally**, a real-time multiplayer gaming platform featuring a modern Pong game, Tic-Tac-Toe, user management, and an integrated live chat system. This project combines a Django backend with a Vanilla JavaScript frontend to deliver a seamless and engaging user experience.

---

## Features

### Core Modules Implemented
1. **Backend Framework (Django)**  
   - Developed using Django to handle backend logic, routing, JWT, and data management.
2. **Database Integration (PostgreSQL)**  
   - Leveraged PostgreSQL for robust and scalable data storage.
3. **Standard User Management**  
   - Secure registration and authentication system.  
   - User profiles with game history and stats.
4. **Remote Authentication**  
   - Implemented OAuth 2.0 for secure login and user authentication.
5. **Real-Time Multiplayer (Remote Players)**  
   - Enabled remote players to compete in Pong games with minimal latency.
6. **Additional Game: Tic-Tac-Toe**  
   - Introduced a second game with matchmaking and gameplay history.
7. **Live Chat**  
   - One of my primary contributions to this project was building the **Live Chat System** using WebSockets for real-time communication, send direct messages, block other users, delete messages, and invite players to games.
8. **Two-Factor Authentication (2FA) with JWT**  
   - Added an extra layer of security with 2FA and JWT for token-based authentication.

---

## Technology Stack

- **Frontend**: HTML/CSS, Vanilla JavaScript  
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL  
- **Authentication**: OAuth 2.0, JWT, Two-Factor Authentication  
- **Deployment**: Docker Compose for containerized development and deployment  

---

## Screenshots

1. Authentication Page
   
   ![Pong Interface](https://github.com/user-attachments/assets/4fde95c2-1ef0-4dbc-b7f1-c3fbb8e58aed)

2. Dashboard
   
   ![Live Chat](https://github.com/user-attachments/assets/8c0c6825-180e-413f-ad1b-581e986d3fc6)

3. Live Chat System
   
   ![Live Chat](https://github.com/user-attachments/assets/20dbc5e0-b448-4f12-ad5b-cabce1ea4c00)

4. Tic-Tac-Toe Game Dashboard
   
   ![Tic-Tac-Toe Game Dashboard](https://github.com/user-attachments/assets/e86ff7c3-17e8-476d-8f28-7ff668326e0a)

5. Pong Game Interface
   
   ![Live Chat](https://github.com/user-attachments/assets/999cb8d3-ec4f-4729-9c06-8037939f94c8)

6. Pong Game Gameplay
   
   ![Live Chat](https://github.com/user-attachments/assets/9c5ae5d9-a6f4-465e-b182-f17b00e8b6f3)

7. Settings/Profile page
    
   ![Live Chat](https://github.com/user-attachments/assets/2e92fa2b-9ee4-4998-a144-6d7efd7b3e6d)

---

## How to Run

1. Clone this repository:  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Build and run:
   ```bash
   make
   ```
3. Access the platform at:
   ```bash
   https://localhost:4443
   ```

## Acknowledgments

A huge thank you to all the team members for their dedication and contributions to TableRally. Your collaboration, creativity, and hard work have been invaluable in making this project a reality.

## Contributors ✨

<a href="https://github.com/mvrouvne/pingpong/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mvrouvne/pingpong" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
