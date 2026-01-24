import type { User } from '@shared';

const USERS_KEY = 'mandarinlab_users';

interface StoredUser {
  id: string;
  email: string;
  password: string;
}

const getUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const fakeLogin = async (
  email: string,
  password: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        resolve({ id: user.id, email: user.email });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const fakeRegister = async (
  email: string,
  password: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      
      if (users.some((u) => u.email === email)) {
        reject(new Error('Email already registered'));
        return;
      }

      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email,
        password,
      };

      users.push(newUser);
      saveUsers(users);

      resolve({ id: newUser.id, email: newUser.email });
    }, 500);
  });
};
