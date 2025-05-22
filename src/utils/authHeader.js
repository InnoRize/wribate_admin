"use client"

export default function authHeader() {
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json'
    };
  }

  const token = localStorage.getItem('token');
  return {
    'authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
}
