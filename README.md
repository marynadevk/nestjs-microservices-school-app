# School app
## Description
The School App is a backend solution for an online learning platform where users can purchase courses. Designed with a microservices architecture.

## Technologies Used
- **Node.js**: Used to develop the server-side of the application.
- **NestJS**: A framework for building efficient, modular server applications.
- **RabbitMQ**: Used for communication between microservices.
- **MongoDB**: A NoSQL database for storing information about users and courses.
- **Mongoose**: A library that models MongoDB data in Node.js.
- **Nx**: A tool for managing monorepos, which simplifies project management and development.

## Getting Started

To set up the project, follow these steps:

1. **Clone the repository:**

```sh
 git clone https://github.com/marynadevk/nestjs-microservices-school-app.git
 cd <project_directory>
```

2. **Install dependencies:**

```sh
  npm ci
```

3. **Create .env files with the same variables as in env.example directory**


4. **Build the application for production:**

```sh
  npm build
```

5. **Start all development servers:**

```sh
  npm start
```

## Services
### Account service
- **Signup**: Handles user registration by accepting an email, password, and display name. It ensures no existing user has the same email and stores the new user's data securely.
- **Validate User**: Verifies user credentials during login by checking the provided email and password against the stored data.
- **Login**: Generates a JWT access token for authenticated users, enabling secure access to protected resources.

- **Change Profile**: Allows users to update their display name, ensuring that the user exists before applying any changes.
- **Buy Course**: Facilitates course purchases using a saga pattern to handle the transaction process, returning a payment link for completion.
- **Check Payments**: Verifies the payment status of a course purchase and updates the user's record based on the payment's current state.

### Api service
The API service serves as an interface for communicating with the account service.


