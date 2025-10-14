"use server"

interface ApplicationData {
  name: string
  email: string
  phone?: string
  university?: string
  teamOrSolo: string
  motivation: string
}

export async function submitApplication(data: ApplicationData) {
  try {
    const response = await fetch("https://api.airtable.com/v0/apprtFcgeXpHY4j8h/Application", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Email: data.email,
          "Phone number": data.phone || "",
          Status: "Pending",
          "University Org": data.university || "",
          "Team Or Solo": data.teamOrSolo,
          Motivation: data.motivation,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Airtable API error:", errorData)
      return { success: false, error: "Failed to submit application" }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error submitting application:", error)
    return { success: false, error: "An error occurred while submitting" }
  }
}
