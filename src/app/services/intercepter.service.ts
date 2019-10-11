import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IntercepterService implements HttpInterceptor {

  constructor() { }

  /**
   * To intercept all http request in app
   *
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof IntercepterService
   */


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const changedReq = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    const changedReq = req.clone();
    return next.handle(changedReq).pipe(catchError(err => {
      const error = err.error.message || err.message;  // to send error message if error occurs in web api
      return throwError(error);
    }));

  }
}
