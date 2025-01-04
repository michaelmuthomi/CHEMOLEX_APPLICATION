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
  phone_number: number,
  role: string
) {
  // Check If user is in the databse
  const user = await checkUser(email);
  if (user["email"]) {
    return "Exists: User already exists";
  }
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

// Reset password for a user
export async function resetPassword(email: string, newPassword: string) {
  try {
    // First check if user exists
    const user = await checkUser(email);
    if (!user["email"]) {
      return "Error: User not found";
    }

    // Update the password
    const { data, error } = await supabase
      .from("users")
      .update({ password_hash: newPassword })
      .eq("email", email);

    if (error) {
      console.error("Error resetting password:", error);
      return `Error: ${error.message}`;
    }

    return "Success: Password reset successfully";
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return "Error: Failed to reset password";
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

// Fetch specific product category
export async function fetchProductInCategory(category_name: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category_name);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return data;
  }
}

// Fetch
export async function fetchSubmittedRepairs(supervisor_id: number) {
  const { data, error } = await supabase
    .from("repairs")
    .select("*, users:technician_id(name), services(name, price)")
    .eq("supervisor_id", supervisor_id);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fecth Assigned Repairs
export async function fetchAssignedRepairs(technician_id: number) {
  const { data, error } = await supabase
    .from("assigned_repairs")
    .select(
      `
    *,
    services (name)
  `
    )
    .eq("technician_id", technician_id);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data:", data);
  }
}

// Fetch productName and quantity in stock
export async function fetchProductNamesAndQuantity() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fetch service requests
export async function fetchServiceRequests() {
  const { data, error } = await supabase
    .from("repairs")
    .select(
      "*, users:customer_id(full_name), services(name, description, service_type)"
    );

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fetch technicians
export async function fetchTechnicians() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "technician");

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// fetch orders
export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, users:user_id(full_name), products:product_id(name, image_url, description)"
    );

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    return data;
  }
}

// Place user orders
export async function placeAnOrder(details: any) {
  const { data, error } = await supabase.from("orders").insert(details);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fetch customers orders
export async function fetchCustomerOrders(user_id: any) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products:product_id(*)")
    .eq("user_id", user_id);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Submit product feedback
export async function submitFeedback(feedback: {
  user_id: number;
  // service_id: number;
  order_id: number;
  rating: number;
  comments: string;
}) {
  const { data, error } = await supabase.from("feedback").insert([feedback]);

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log("Feedback submitted:", data);
    return data;
  }
}

// Fetch available drivers
export async function fetchDrivers() {
  // Fetch user IDs from dispatches
  const { data: dispatches, error: dispatchesError } = await supabase
    .from("dispatches")
    .select("user_id");

  if (dispatchesError) {
    console.error(dispatchesError);
    return;
  }

  const assignedUserIds = dispatches.map((assignment) => assignment.user_id);

  // Fetch all drivers
  const { data: allDrivers, error: driversError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "driver");

  if (driversError) {
    console.error(driversError);
    return;
  }

  // Filter drivers to exclude those in assignedUserIds
  const availableDrivers = allDrivers.filter(
    (driver) => !assignedUserIds.includes(driver.user_id)
  );

  return availableDrivers;
}

// Fetch Products and their quantity in stock
export async function fetchProductsAndQuantityFromDB() {
  const { data, error } = await supabase
    .from("products")
    .select("product_id, name, price, stock_quantity, image_url");

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Fetch suppliers
export async function fetchSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*, users(*)")
    .eq("users.role", "supplier");

  if (error) {
    return `Error: ${error.message || JSON.stringify(error)}`;
  } else {
    console.log(data);
    return data;
  }
}

// Add New Product to DB
export async function insertNewProductToDB(
  name: string,
  description: string,
  price: number,
  supplier_id: number,
  stock_quantity: number,
  category: string,
  image_url: string
) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price,
        supplier_id,
        stock_quantity,
        category,
        image_url,
      },
    ])
    .single();

  if (error) {
    console.error(error);
    return "Error:" + error;
  } else {
    return "Success:" + data;
  }
}

export async function updateUserProfile(
  email: string,
  updates: {
    full_name?: string;
    username?: string;
    phone_number?: string;
    address?: string;
  }
) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("email", email)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// Fetch driver_id from dispatched table using orderId
export async function fetchDispatchedByOrderId(orderId: number) {
  console.log('Order Id', orderId)
  const { data, error } = await supabase
    .from("dispatches")
    .select("driver_id")
    .eq("order_id", orderId)
    .single();

  if (error) {
    console.error("Error fetching dispatched by order ID:", error);
    return null; // or handle the error as needed
  }
  return data;
}

// Fetch driver's full_name from users table using driverId
export async function fetchDriverById(driverId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("full_name")
    .eq("user_id", driverId)
    .single();

  if (error) {
    console.error("Error fetching driver by ID:", error);
    return null; // or handle the error as needed
  }
  return data;
}