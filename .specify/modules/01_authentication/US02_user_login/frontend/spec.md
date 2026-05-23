# Frontend Specification: User Login UI (US-02)

**Feature**: 01-user-login-ui  
**Module**: 01_authentication  
**Route**: `/login` (Public root gateway)

---

## 1. UI Component Hierarchy

The login view is the public entrance of the platform. It features a simplified layout containing the credential card.

[Public Layout Container]
│
└── [LoginCardContainer]
│
├── [LoginForm]
│         ├── [InputField: email (type="email")]
│         └── [InputField: password (type="password")]
│
└── [SubmitButton] -> Trigger Auth Context Request


---

## 2. Token Lifetime & Client Management

- **Storage**: Upon receiving a `200 OK` response, the client MUST store the `access_token` securely in `LocalStorage` or `SessionStorage`.
- **Global Interceptor**: Axios/Fetch global config must be refactored. It must actively read this token before every request and append it to the `Authorization: Bearer <token>` header.
- **Redirection**: Successful login routes the user dynamically to `/admin/dashboard` or the default home lay