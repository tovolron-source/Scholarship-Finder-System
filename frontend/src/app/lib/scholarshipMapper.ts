/**
 * Maps scholarship fields accounting for both database (camelCase) and mock data (PascalCase) formats
 */
export const scholarshipMapper = {
  getId: (scholarship: any) => String(scholarship.id || scholarship.ScholarshipID || ''),
  getName: (scholarship: any) => scholarship.name || scholarship.ScholarshipName || '',
  getProvider: (scholarship: any) => scholarship.provider || scholarship.Provider || '',
  getDescription: (scholarship: any) => scholarship.description || scholarship.Description || '',
  getType: (scholarship: any) => scholarship.type || scholarship.Type || '',
  getGwaRequirement: (scholarship: any) => scholarship.gwaRequirement || scholarship.GWARequirement || scholarship.gpaRequirement || scholarship.GPARequirement || 0,
  getSlots: (scholarship: any) => scholarship.slots || scholarship.Slots || '',
  getAmount: (scholarship: any) => scholarship.amount || scholarship.Amount || '',
  getDeadline: (scholarship: any) => scholarship.deadline || scholarship.Deadline || '',
  getEligibilityRequirements: (scholarship: any) => {
    const eligReqs = scholarship.eligibilityRequirements || 
                     (scholarship.EligibilityRequirements ? JSON.parse(scholarship.EligibilityRequirements) : {});
    return eligReqs;
  },
  
  /**
   * Extract all fields at once for efficient rendering
   */
  getScholarshipData: (scholarship: any) => ({
    id: String(scholarship.id || scholarship.ScholarshipID || ''),
    name: scholarship.name || scholarship.ScholarshipName || '',
    provider: scholarship.provider || scholarship.Provider || '',
    description: scholarship.description || scholarship.Description || '',
    type: scholarship.type || scholarship.Type || '',
    gwaRequirement: scholarship.gwaRequirement || scholarship.GWARequirement || scholarship.gpaRequirement || scholarship.GPARequirement || 0,
    slots: scholarship.slots || scholarship.Slots || '',
    amount: scholarship.amount || scholarship.Amount || '',
    deadline: scholarship.deadline || scholarship.Deadline || '',
    eligibilityRequirements: scholarship.eligibilityRequirements || 
                            (scholarship.EligibilityRequirements ? JSON.parse(scholarship.EligibilityRequirements) : {}),
  }),
};
