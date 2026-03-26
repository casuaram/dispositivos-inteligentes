package com.dispositivos.apidispositivos.controller;

import com.dispositivos.apidispositivos.model.Dispositivo;
import com.dispositivos.apidispositivos.repository.DispositivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dispositivos")
@CrossOrigin(origins = "*")
public class DispositivoController {
    
    @Autowired
    private DispositivoRepository dispositivoRepository;
    
    // GET Todos
    @GetMapping
    public List<Dispositivo> getAll() {
        return dispositivoRepository.findAll();
    }
    
    // GET by ID 
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Dispositivo dispositivo = dispositivoRepository.findById(id).orElse(null);
        
        if (dispositivo == null) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Dispositivo no encontrado con ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        return ResponseEntity.ok(dispositivo);
    }
    
    // POST - Crear 
    @PostMapping
    public Dispositivo create(@RequestBody Dispositivo dispositivo) {
        return dispositivoRepository.save(dispositivo);
    }
    
    // PUT - Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Dispositivo dispositivo) {
        Dispositivo existing = dispositivoRepository.findById(id).orElse(null);
        
        if (existing == null) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Dispositivo no encontrado con ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        existing.setNombre(dispositivo.getNombre());
        existing.setMarca(dispositivo.getMarca());
        existing.setTipo(dispositivo.getTipo());
        existing.setFechaLanzamiento(dispositivo.getFechaLanzamiento());
        existing.setPrecio(dispositivo.getPrecio());
        existing.setImagenUrl(dispositivo.getImagenUrl());
        existing.setDescripcion(dispositivo.getDescripcion());
        existing.setEspecificaciones(dispositivo.getEspecificaciones());
        
        return ResponseEntity.ok(dispositivoRepository.save(existing));
    }
    
    // DELETE 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Dispositivo existing = dispositivoRepository.findById(id).orElse(null);
        
        if (existing == null) {
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Dispositivo no encontrado con ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        dispositivoRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Dispositivo eliminado correctamente con ID: " + id);
        return ResponseEntity.ok(response);
    }
}