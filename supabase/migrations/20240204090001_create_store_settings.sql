create table if not exists store_settings (
  id uuid default gen_random_uuid() primary key,
  store_name text not null default 'Local Cafe',
  address text,
  phone text,
  wifi_pass text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default row if not exists
insert into store_settings (store_name, address, phone)
select 'Local Cafe', '123 Đường Cà Phê', '0909000111'
where not exists (select 1 from store_settings);
