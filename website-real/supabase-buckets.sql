-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('products', 'products', true),
  ('tickets', 'tickets', false),
  ('orders', 'orders', false),
  ('avatars', 'avatars', true),
  ('admin', 'admin', false);