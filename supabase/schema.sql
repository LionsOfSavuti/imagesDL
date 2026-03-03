create extension if not exists pgcrypto;

create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  created_at timestamptz default now()
);

create table if not exists spare_parts (
  id uuid primary key default gen_random_uuid(),
  part_number text unique not null,
  name text not null,
  description text,
  category text not null,
  unit_price numeric not null default 0,
  reorder_point integer not null default 0,
  quantity_on_hand integer not null default 0,
  plant_id uuid references plants(id),
  created_at timestamptz default now()
);

create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  transaction_type text not null,
  quantity integer not null,
  notes text,
  plant_id uuid references plants(id),
  created_at timestamptz default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb,
  user_id uuid,
  session_id text,
  created_at timestamptz default now()
);

create table if not exists ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  recommendation_type text not null,
  priority text not null default 'medium',
  suggested_action text not null,
  reasoning text,
  plant_id uuid references plants(id),
  created_at timestamptz default now()
);

create table if not exists eoq_analysis (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  annual_demand integer default 0,
  ordering_cost numeric default 0,
  holding_cost_per_unit numeric default 0,
  economic_order_quantity numeric default 0,
  total_annual_cost numeric default 0,
  number_of_orders_per_year numeric default 0,
  plant_id uuid references plants(id),
  updated_at timestamptz default now()
);

create table if not exists kraljic_analysis (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  supply_risk numeric not null check (supply_risk >= 0 and supply_risk <= 1),
  profit_impact numeric not null check (profit_impact >= 0 and profit_impact <= 1),
  category text not null,
  plant_id uuid references plants(id),
  updated_at timestamptz default now()
);

create table if not exists demand_forecasts (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  forecast_date date not null,
  predicted_demand numeric default 0,
  confidence_interval numeric default 0,
  plant_id uuid references plants(id),
  created_at timestamptz default now()
);

create table if not exists maintenance_predictions (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references spare_parts(id),
  predicted_failure_date date,
  failure_probability numeric default 0 check (failure_probability >= 0 and failure_probability <= 1),
  recommended_action text,
  plant_id uuid references plants(id),
  created_at timestamptz default now()
);

create index if not exists idx_spare_parts_part_number on spare_parts(part_number);
create index if not exists idx_spare_parts_plant_id on spare_parts(plant_id);
create index if not exists idx_spare_parts_created_at on spare_parts(created_at);
create index if not exists idx_inventory_transactions_part_id on inventory_transactions(part_id);
create index if not exists idx_inventory_transactions_plant_id on inventory_transactions(plant_id);
create index if not exists idx_inventory_transactions_created_at on inventory_transactions(created_at);

alter table plants enable row level security;
alter table spare_parts enable row level security;
alter table inventory_transactions enable row level security;
alter table analytics_events enable row level security;
alter table ai_recommendations enable row level security;
alter table eoq_analysis enable row level security;
alter table kraljic_analysis enable row level security;
alter table demand_forecasts enable row level security;
alter table maintenance_predictions enable row level security;

create policy "public_access_plants" on plants for all using (true) with check (true);
create policy "public_access_spare_parts" on spare_parts for all using (true) with check (true);
create policy "public_access_inventory_transactions" on inventory_transactions for all using (true) with check (true);
create policy "public_access_analytics_events" on analytics_events for all using (true) with check (true);
create policy "public_access_ai_recommendations" on ai_recommendations for all using (true) with check (true);
create policy "public_access_eoq_analysis" on eoq_analysis for all using (true) with check (true);
create policy "public_access_kraljic_analysis" on kraljic_analysis for all using (true) with check (true);
create policy "public_access_demand_forecasts" on demand_forecasts for all using (true) with check (true);
create policy "public_access_maintenance_predictions" on maintenance_predictions for all using (true) with check (true);

insert into plants (name, location) values
('Main Manufacturing Plant', 'Detroit, MI'),
('Assembly Plant North', 'Chicago, IL'),
('Distribution Center', 'Los Angeles, CA')
on conflict do nothing;

insert into spare_parts (part_number, name, description, category, unit_price, reorder_point, quantity_on_hand, plant_id)
select * from (
  values
  ('BRG-1001','Bearing Assembly 6205','High-speed radial bearing','Mechanical',45.50,20,75,(select id from plants where name='Main Manufacturing Plant')),
  ('MTR-2045','Servo Motor 2kW','Precision servo motor','Electrical',1280.00,5,8,(select id from plants where name='Main Manufacturing Plant')),
  ('HYD-3302','Hydraulic Cylinder 50mm','Double-acting cylinder','Hydraulic',390.75,10,12,(select id from plants where name='Assembly Plant North')),
  ('PNE-1450','Air Filter Regulator','Pneumatic FRL unit','Pneumatic',120.30,25,60,(select id from plants where name='Assembly Plant North')),
  ('SAF-9001','Safety Relay Module','Emergency-stop relay','Safety',210.00,8,6,(select id from plants where name='Distribution Center')),
  ('CON-7788','Industrial Lubricant 5L','Synthetic maintenance oil','Consumables',32.99,30,110,(select id from plants where name='Distribution Center'))
) as v(part_number, name, description, category, unit_price, reorder_point, quantity_on_hand, plant_id)
on conflict (part_number) do nothing;
