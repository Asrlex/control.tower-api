import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cacheableRoutes = ['api'];
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {
    this.cacheableRoutes = this.cacheableRoutes.map((route) => `/${route}`);
    this.logger.log(`\tCacheInterceptor initialized`);
  }

  /**
   * Método para interceptar las peticiones y almacenarlas en caché si es pertinente
   * @param context - Contexto de ejecución
   * @param next - Siguiente manejador de la petición
   * @returns Retorna un observable con la respuesta
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (!this.cacheManager) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    if (
      !this.cacheableRoutes.includes(request.baseUrl) ||
      request.method !== 'GET'
    ) {
      return next.handle();
    }

    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next
      .handle()
      .pipe(tap((response) => this.cacheManager.set(cacheKey, response)));
  }

  /**
   * Método para generar la clave de caché, que será la URL de la petición
   * @param request - Petición
   * @returns Retorna la clave de caché
   */
  private generateCacheKey(request: any): string {
    return `${request.url}`;
  }
}
