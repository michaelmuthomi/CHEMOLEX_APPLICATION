import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
// Check for a user in the 'users' table
export async function checkUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return false;
  } else if (data) {
    return data;
  } else {
    return false;
  }
}

// Validate user credentials
export async function validateUserCredentials(email: string, password: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password_hash", password)
    .single();

  if (error) {
    return error;
  } else if (data) {
    return data;
  } else {
    return error;
  }
}

// Function that adds users to the database
export async function addUserToDB(
  username: string,
  full_name: string,
  email: string,
  password_hash: string,
  phone_number: number
) {
  // Check If user is in the databse
  const user = await checkUser(email);
  if (user["email"]) {
    return "Exists: User already exists";
  }
  const role = "Customer";
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, full_name, email, password_hash, phone_number, role }])
    .single();

  if (error) {
    return "Error:" + error;
  } else {
    return "Success:" + data;
  }
}

// Insert feedback to table
export async function insertFeedbackToDB(
  user_id: string,
  product_id: number,
  feedback_message: string,
  rating: number
) {
  const { data, error } = await supabase
    .from("feedback")
    .insert([{ user_id, product_id, feedback_message, rating }])
    .single();

  if (error) {
    return "Error:" + error;
  } else {
    return "Success:" + data;
  }
}

// Update user account details
// Function that updates user details
export async function updateUserDetails(
  username: string,
  full_name: string,
  email: string,
  password_hash: string,
  phone_number: number
) {
  const { data, error } = await supabase
    .from("users")
    .update({ username, full_name, email, password_hash, phone_number })
    .eq("email", email)
    .single();

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return `Success: ${JSON.stringify(data)}`;
  }
}

// Reset user password
export async function resetUserPassword(email: string, password_hash: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ password_hash })
    .eq("email", email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return `Success: ${JSON.stringify(data)}`;
  }
}

// Fetch Products data
export async function fetchProductsFromDB() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fetch single Product from db
export async function fetchProductFromDB(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_id", id)
    .single();

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return data;
  }
}

// Count total number of products in cart
export async function countTotalProductsInCart(user_email: string) {
  const { data, error } = await supabase
    .from("cart")
    .select("quantity")
    .eq("user_email", user_email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    let total = 0;
    data.forEach((item: any) => {
      total += item.quantity;
    });
    return total;
  }
}

// Check if product exists in cart
export async function checkProductInCart(
  product_id: number,
  user_email: string
) {
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("product_id", product_id)
    .eq("user_email", user_email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return data;
  }
}

// Update product quantity in cart
export async function updateProductQuantityInCart(
  product_id: number,
  quantity: number,
  user_email: string
) {
  const { data, error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("product_id", product_id)
    .eq("user_email", user_email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return `Success: ${JSON.stringify(data)}`;
  }
}

// Insert products to cart
export async function insertProductsToCart(
  product_id: number,
  quantity: number,
  user_email: string
) {
  const { data, error } = await supabase
    .from("cart")
    .insert({ product_id, quantity, user_email });

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return `Success: ${JSON.stringify(data)}`;
  }
}

// Remove product from cart
export async function removeProductFromCart(
  product_id: number,
  user_email: string
) {
  const { data, error } = await supabase
    .from("cart")
    .delete()
    .eq("product_id", product_id)
    .eq("user_email", user_email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return `Success: ${JSON.stringify(data)}`;
  }
}

// Fetch products from cart
export async function fetchProductsFromCart(user_email: string) {
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_email", user_email);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return data;
  }
}
