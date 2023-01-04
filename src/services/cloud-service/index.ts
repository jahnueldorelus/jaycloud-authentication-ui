import { Service } from "@app-types/entities";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class CloudService {
  private services: Service[] | null;

  constructor() {
    this.services = null;
  }

  get servicesList() {
    return this.services;
  }

  async getServices(): Promise<Service[] | null> {
    try {
      // Retrieves the list of services
      const servicesResponse = await apiService.request(
        apiService.routes.get.services.list,
        { method: "GET" }
      );

      if (!servicesResponse || isAxiosError(servicesResponse)) {
        throw Error();
      }

      const servicesList = servicesResponse.data as Service[];

      // Retrieves the logo for each service
      for (let x = 0; x < servicesList.length; x++) {
        try {
          const service = servicesList[x] as Service;

          const logoResponse = await apiService.request(
            apiService.routes.get.services.logo + `/${service._id}`,
            { method: "GET", responseType: "blob" }
          );

          if (logoResponse && !isAxiosError(logoResponse)) {
            service.logo = logoResponse.data;
          }
        } catch (error) {
          // Does nothing if error occurs while retrieving logo. Moves on to next logo retrieval
        }
      }

      this.services = servicesList;
    } catch (error) {
      this.services = null;
    } finally {
      return this.services;
    }
  }

  /**
   * Retrieves a service based upon its id.
   * @param serviceId The id of the service to retrieve
   */
  getServiceById(serviceId: string): Service | null {
    if (this.services) {
      return this.services.find((service) => service._id === serviceId) || null;
    } else {
      return null;
    }
  }
}

export const cloudService = new CloudService();
