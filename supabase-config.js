// 🚀 SUPABASE CONFIGURATION
// Replace the values below with YOUR Supabase project details
// Get these from: Supabase Dashboard > Settings > API

const SUPABASE_URL = 'https://mniahzktldeljezejjyy.supabase.co';  // Example: https://abcdefghijk.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaWFoemt0bGRlbGplemVqanl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NzMyMDIsImV4cCI6MjA3NzM0OTIwMn0.6FUBint7wjY-pPT-uILf1KtZB_DRuAxjHIk0h2bhhiw';  // Long string starting with eyJ...

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized successfully!');

// Helper functions
const db = {
  // Get business by ID
  async getBusiness(id) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all businesses
  async getAllBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create or update business
  async saveBusiness(id, businessData) {
    const { data, error } = await supabase
      .from('businesses')
      .upsert({ id, ...businessData, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete business
  async deleteBusiness(id) {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get user by ID
  async getUser(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create user record
  async createUser(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .insert({ id, ...userData })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer');

    if (error) throw error;
    return data;
  }
};

// Auth helper
const auth = {
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Create user
  async createUser(email, password) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) throw error;
    return data;
  }
};

// Storage helper
const storage = {
  // Upload image
  async uploadImage(file, businessId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('business-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Delete image
  async deleteImage(url) {
    const path = url.split('/business-images/')[1];
    const { error } = await supabase.storage
      .from('business-images')
      .remove([path]);

    if (error) throw error;
  }
};