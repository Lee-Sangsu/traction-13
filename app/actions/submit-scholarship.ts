"use server"

interface ScholarshipData {
  name: string
  email: string
  university: string
  reason: string
}

export async function submitScholarship(data: ScholarshipData) {
  try {
    const response = await fetch("https://api.airtable.com/v0/apprtFcgeXpHY4j8h/Scholarship", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Email: data.email,
          University: data.university,
          Reason: data.reason,
          Status: "Pending",
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Airtable API error:", errorData)
      return { success: false, error: "Failed to submit scholarship request" }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error submitting scholarship:", error)
    return { success: false, error: "An error occurred while submitting" }
  }
}
