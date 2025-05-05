import { LaunchFilters } from "../store/filterStore";
import { CrewMember, Launch, LaunchesQueryParams, Launchpad, Rocket } from "../types/spaceX.types";


class SpaceXAPI {
    public baseUrl = import.meta.env.VITE_API_BASE_URL;
    private async fetchData<T>(endpoint: string): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return response.json() as Promise<T>;
    }
  
    private async postData<T>(endpoint: string, data: any): Promise<T> {

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json() as Promise<T>;
    }
  
    // Launches
    async getAllLaunches(): Promise<Launch[]> {
      return this.fetchData<Launch[]>('/launches');
    }
  
    async getLaunchById(id: string): Promise<Launch> {
      return this.fetchData<Launch>(`/launches/${id}`);
    }
  
    // Rockets
    async getAllRockets(): Promise<Rocket[]> {
      return this.fetchData<Rocket[]>('/rockets');
    }
  
    async getRocketById(id: string): Promise<Rocket> {
      return this.fetchData<Rocket>(`/rockets/${id}`);
    }
  
    // Crew
    async getAllCrew(): Promise<CrewMember[]> {
      return this.fetchData<CrewMember[]>('/crew');
    }
  
    async getCrewMemberById(id: string): Promise<CrewMember> {
      return this.fetchData<CrewMember>(`/crew/${id}`);
    }
  
    // Launchpads
    async getLaunchpadById(id: string): Promise<Launchpad> {
      return this.fetchData<Launchpad>(`/launchpads/${id}`);
    }
  
    // Get launches by rocket ID for data enrichment
    async getLaunchesByRocketId(rocketId: string): Promise<Launch[]> {
 
     return this.fetchData<Launch[]>(`/launches?rocketId=${rocketId}`);
    }
    
    // Get launches by crew member ID for data enrichment
    async getLaunchesByCrewMemberId(crewId: string): Promise<Launch[]> {
      return this.fetchData<Launch[]>(`/launches?crewId=${crewId}`);
    }
  }
  
  export const spaceXAPI = new SpaceXAPI();