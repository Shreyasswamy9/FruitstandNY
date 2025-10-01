import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route"; // Uncomment when you have auth configured

export async function POST(req: NextRequest) {
  try {
    // Get session to verify user is authenticated
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      preferences
    } = body;

    // Here you would save the user profile data to your database
    // Example with your User model:
    /*
    import { User } from "@/database/User";
    
    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      preferences,
      profileComplete: true,
      analytics: {
        profileCompletedAt: new Date(),
        signupMethod: session.user.provider || 'email',
        demographics: {
          age: calculateAge(dateOfBirth),
          gender,
          location: {
            city: address.city,
            state: address.state,
            zipCode: address.zipCode
          }
        }
      }
    }, { new: true });
    */

    // For now, return success
    console.log("Profile data received:", {
      userId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      preferences
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile completed successfully",
      analytics: {
        age: calculateAge(dateOfBirth),
        gender,
        location: `${address.city}, ${address.state}`,
        marketingOptIn: preferences.emailMarketing,
        smsOptIn: preferences.smsMarketing,
        analyticsOptIn: preferences.analytics
      }
    });

  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 }
    );
  }
}

function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}