-- Seed sample rooms
INSERT INTO public.rooms (name, description, capacity, price_per_hour, amenities)
VALUES
  ('Conference Room A', 'Large conference room with projector and whiteboard', 20, 50.00, ARRAY['Projector', 'Whiteboard', 'WiFi', 'AC']),
  ('Meeting Room B', 'Medium meeting room ideal for team discussions', 10, 30.00, ARRAY['Whiteboard', 'WiFi', 'AC']),
  ('Board Room', 'Executive board room with high-end facilities', 15, 75.00, ARRAY['Projector', 'Video Conference', 'WiFi', 'AC', 'Catering']),
  ('Training Room', 'Spacious training room with AV equipment', 30, 40.00, ARRAY['Projector', 'WiFi', 'AC', 'Training Desks']),
  ('Private Office', 'One-on-one meeting office', 4, 20.00, ARRAY['WiFi', 'AC']);
