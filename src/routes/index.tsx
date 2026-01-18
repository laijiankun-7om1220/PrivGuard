import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Detect } from '@/pages/Detect';
import { Help } from '@/pages/Help';
import { PersonalCenter } from '@/pages/PersonalCenter';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { AppLayout } from '@/components/Layout/AppLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return <div>{t.common.loading}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/?login=true" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/detect"
          element={
            <PrivateRoute>
              <Detect />
            </PrivateRoute>
          }
        />
        <Route path="/help" element={<Help />} />
        <Route
          path="/personal-center"
          element={
            <PrivateRoute>
              <PersonalCenter />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
};
