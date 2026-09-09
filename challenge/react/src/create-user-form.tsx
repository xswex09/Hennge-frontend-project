import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic3dldGhhbWFkaGFubW9oYW4wOUBnbWFpbC5jb20iXSwiaXNzIjoiaGVubmdlLWFkbWlzc2lvbi1jaGFsbGVuZ2UiLCJzdWIiOiJjaGFsbGVuZ2UifQ.1hws_Zy4PYHD-dNkLV3Aanzaj7vXKlR5SRlb1qHCnPg"; 

function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 10) errors.push("Password must be at least 10 characters long");
  if (password.length > 24) errors.push("Password must be at most 24 characters long");
  if (/\s/.test(password)) errors.push("Password cannot contain spaces");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  return errors;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const passwordErrors = getPasswordErrors(password);
  const isPasswordInvalid = passwordErrors.length > 0;

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    setApiError(null);

    // Don't call API if username is blank or password is invalid
    if (!username || isPasswordInvalid) return;

    try {
      const response = await fetch(
        "https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        setUserWasCreated(true);
      } else if (response.status === 401 || response.status === 403) {
        setApiError("Not authenticated to access this resource.");
      } else if (response.status === 400) {
        setApiError("Sorry, the entered password is not allowed, please try a different one.");
      } else {
        setApiError("Something went wrong, please try again.");
      }
    } catch {
      setApiError("Something went wrong, please try again.");
    }
  }

  return (
    <div style={formWrapper}>
      <form style={form}>
        <label htmlFor="username" style={formLabel}>Username</label>
        <input
          id="username"
          aria-label="Username"
          aria-invalid={username === "" ? undefined : undefined}
          style={formInput}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password" style={formLabel}>Password</label>
        <input
          id="password"
          aria-label="Password"
          aria-invalid={password !== "" && isPasswordInvalid ? true : undefined}
          style={formInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Client-side password validation errors - shown dynamically as user types */}
        {password !== "" && passwordErrors.length > 0 && (
          <ul style={errorList}>
            {passwordErrors.map((err) => (
              <li key={err} style={errorItem}>{err}</li>
            ))}
          </ul>
        )}

        {/* API error messages */}
        {apiError && <p style={apiErrorStyle}>{apiError}</p>}

        <button style={formButton} onClick={handleSubmit}>Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

const errorList: CSSProperties = {
  margin: '4px 0',
  paddingLeft: '20px',
  color: '#c0392b',
  fontSize: '13px',
};

const errorItem: CSSProperties = {
  marginBottom: '2px',
};

const apiErrorStyle: CSSProperties = {
  color: '#c0392b',
  fontSize: '13px',
  margin: '4px 0',
};